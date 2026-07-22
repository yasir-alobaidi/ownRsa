#!/bin/sh
set -eu

# Issues (first run) or renews (subsequent runs) the Let's Encrypt cert for
# this site, then copies it where nginx expects it and reloads nginx if
# anything changed. Safe to run repeatedly / on a schedule -- `certbot renew`
# is a no-op unless the cert is within ~30 days of expiring.
#
# Run from anywhere; always operates relative to the repo root regardless.

cd "$(dirname "$0")/.."

DOMAIN=texasroadsideassist.com
EMAIL=help@texasroadsideassist.com

mkdir -p letsencrypt certbot-webroot certs

# sudo throughout: the invoking user isn't in the `docker` group on this
# host, and certbot's container runs as root, so the private key it writes
# under letsencrypt/ is root-owned/mode 600 on the host too.
if [ ! -d "letsencrypt/live/$DOMAIN" ]; then
  echo "No existing certificate -- requesting a new one for $DOMAIN and www.$DOMAIN"
  sudo docker run --rm \
    -v "$(pwd)/letsencrypt:/etc/letsencrypt" \
    -v "$(pwd)/certbot-webroot:/var/www/certbot" \
    certbot/certbot certonly \
    --webroot -w /var/www/certbot \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" --agree-tos --non-interactive
else
  echo "Existing certificate found -- checking for renewal"
  sudo docker run --rm \
    -v "$(pwd)/letsencrypt:/etc/letsencrypt" \
    -v "$(pwd)/certbot-webroot:/var/www/certbot" \
    certbot/certbot renew --webroot -w /var/www/certbot
fi

# Copy (not symlink) -- certbot's live/ dir is itself symlinks into archive/,
# which isn't mounted into the web container, so -L resolves to real content.
sudo cp -L "letsencrypt/live/$DOMAIN/fullchain.pem" certs/fullchain.pem
sudo cp -L "letsencrypt/live/$DOMAIN/privkey.pem" certs/privkey.pem
sudo chown "$(id -u):$(id -g)" certs/fullchain.pem certs/privkey.pem

echo "Reloading nginx"
sudo docker exec ownrsa-web-1 nginx -s reload
