"use client";

import { useState, useEffect } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const bairrosGeoJSON = "/bairros-fortaleza.geojson";

const vendasPorBairro = {
  "Henrique Jorge": 320,
  Centro: 800,
  Meireles: 200,
  Benfica: 50,
  Parangaba: 30,
  Messejana: 150,
};

export default function MapaFortaleza() {
  const [geojson, setGeojson] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    fetch(bairrosGeoJSON)
      .then((res) => res.json())
      .then((data) => {
        data.features.forEach((feature) => {
          const nomeBairro = feature.properties.Nome;
          const vendas = vendasPorBairro[nomeBairro] || 0;
          feature.properties.vendas = vendas;
        });
        setGeojson(data);
      })
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));
  }, []);

  const handleMapClick = (event) => {
    const feature = event.features && event.features[0];
    if (feature) {
      const { Nome, vendas } = feature.properties;
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        bairro: Nome,
        vendas: vendas,
      });
    }
  };

  return (
    <Map
      initialViewState={{
        latitude: -3.7305,
        longitude: -38.5218,
        zoom: 11,
      }}
      style={{
        width: "30%",
        height: "400px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        boxShadow: "1px 1px 5px 1px #e4e4e4 ",
      }}
      mapStyle={{
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: ["https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [
          {
            id: "raster-layer",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      }}
      interactiveLayerIds={["bairros-layer"]}
      onClick={handleMapClick}
    >
      {geojson && (
        <Source id="bairros" type="geojson" data={geojson}>
          <Layer
            id="bairros-layer"
            type="fill"
            paint={{
              "fill-color": [
                "case",
                ["<", ["get", "vendas"], 50],
                "#FFFFFF12",
                ["<", ["get", "vendas"], 100],
                "#007bff",
                "#ff0000",
              ],
              "fill-opacity": 0.7,
            }}
          />
          <Layer
            id="bairros-bordas"
            type="line"
            paint={{
              "line-color": "#595959",
              "line-width": 1,
            }}
          />
        </Source>
      )}
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          anchor="top"
        >
          <div>
            <strong>{popupInfo.bairro}</strong>
            <p>Vendas: {popupInfo.vendas}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
