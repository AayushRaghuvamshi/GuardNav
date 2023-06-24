import React, { useEffect, useState, useMemo } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  DirectionsService,
  HeatmapLayer,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPosition, resetLocation } from "../reducers/LocationReducer";
import PageContainer from "./PageContainer";
import LoadingSpinner from "./LoadingSpinner";
import WeatherInformation from "./WeatherInformation";
import { useTheme } from "@mui/material/styles";
import styleComp from "@emotion/styled";
import { css } from "@emotion/react";

import { SideNavBar, PageSearchBar, HistoryCard, RouteDrawer } from "./index";
import { setFrom, setTo } from "../reducers/TripReducer";


const MapTopContainer = styleComp.div`
    display: flex;
    align-items: start;
`;

const MapTopLeft = styleComp.div`
    display: flex;
    justify-content: start;
    width: 50vw;

    & > div {
        transition: all 0.4s ease-in-out;
    ${({ hide }) =>
      hide &&
      css`
        transform: translateX(-100%);
      `}
`;

const MapSearch = styleComp.div`
    display: flex;
    flex-flow: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    margin-left: ${({ theme }) => `${theme.margins.values.marginSides}`};
    width: 60%;
    padding: ${({ theme }) =>
      `${theme.margins.values.marginSides} ${theme.margins.values.marginTopBottom}`};
`;

const MapTopRight = styleComp.div`
    display: flex;
    justify-content: start;
    padding: ${({ theme }) =>
      `${theme.margins.values.marginSides} ${theme.margins.values.marginTopBottom}`};
`;

const Map = ({ openRouteDrawer, isRouteDrawerOpen, crimeData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const from = useSelector((state) => state.trip.from);
  const to = useSelector((state) => state.trip.to);

  const [directions, setDirections] = useState(null);

  const directionsServiceOptions = useMemo(
    () => ({
      destination: to,
      origin: from,
      travelMode: "WALKING",
    }),
    [from, to]
  );

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
      } else {
        // Handle API response errors
      }
    }
  };

  const { currentPosition } = useSelector((state) => state.location);

  const onHistoryCardClick = (to) => {
    dispatch(setTo(to));
    openRouteDrawer();
  };

  const onSearch = (to) => {
    dispatch(setTo(to));
    openRouteDrawer();
  };

  return (
    <PageContainer>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {currentPosition && (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            zoom={16}
            center={currentPosition}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              rotateControl: true,
            }}
          >
            <HeatmapLayer
              data={crimeData.map((item) => ({
                location: item.location,
                weight: item.weight,
              }))}
              options={{
                radius: 50,
              }}
            />
            <MapTopContainer>
              <MapTopLeft hide={isRouteDrawerOpen}>
                <MapSearch>
                  <PageSearchBar onSearch={onSearch} />
                  <HistoryCard onClick={onHistoryCardClick} />
                  <HistoryCard onClick={onHistoryCardClick} />
                  <HistoryCard onClick={onHistoryCardClick} />
                </MapSearch>
              </MapTopLeft>
              <MapTopRight>
                <WeatherInformation />
              </MapTopRight>
              <DirectionsService
                options={directionsServiceOptions}
                callback={directionsCallback}
              />
              {directions && <DirectionsRenderer directions={directions} />}
              <Marker position={currentPosition} />
            </MapTopContainer>
          </GoogleMap>
        )}
      </div>
    </PageContainer>
  );
};

export default Map;
