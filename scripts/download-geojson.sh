#!/bin/bash
# EPEP — Download India GeoJSON boundaries
# Source: Datameet India (MIT Licensed, open data)
# Run once before starting development: bash scripts/download-geojson.sh

set -e

echo "Downloading India States GeoJSON..."
curl -L -o public/india-states.geojson \
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson"

echo "Downloading India Constituencies GeoJSON..."
curl -L -o public/india-constituencies.geojson \
  "https://raw.githubusercontent.com/datameet/maps/master/parliamentary-constituencies/india_pc_2019.geojson"

echo ""
echo "GeoJSON files downloaded successfully:"
echo "  public/india-states.geojson"
echo "  public/india-constituencies.geojson"
