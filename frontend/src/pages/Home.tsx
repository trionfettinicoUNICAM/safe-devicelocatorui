import React from "react";
import {
  IonContent,
  IonMenu,
  IonPage,
  IonSplitPane,
  useIonRouter,
} from "@ionic/react";
import "./Home.css";
import { Map } from "../components/map";
import { Motion, Plugins } from "@capacitor/core";
import Popover from "../components/mapControls/Popover";
import { LocationFab } from "../components/mapControls/locationButton";
import SensorList from "../components/sensorList/sensorList";


const Home: React.FC = () => {

  return (
    <IonPage id="home-page">
      <IonSplitPane contentId="map" when="xs">
        <IonMenu contentId="map" id="device-menu">
          <SensorList />
        </IonMenu>
        <IonContent id="map">
          <Map />
          <Popover />
          <LocationFab />
        </IonContent>
      </IonSplitPane>
    </IonPage>
  );
};

export default Home;
