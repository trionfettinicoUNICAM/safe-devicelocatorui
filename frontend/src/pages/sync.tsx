import React, { useContext, useEffect, useState } from "react";
import {
    IonButton,
    IonCol,
    IonContent,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonPopover,
    IonToolbar,
    useIonRouter,
    UseIonRouterResult,
    useIonToast,
} from '@ionic/react';
import { Plugins } from "@capacitor/core";
import { MapContext } from "../provider/MapProvider";
import { ContextMapType } from "../provider/type";
import { cloudDoneOutline, downloadOutline } from "ionicons/icons";

import './sync.css';

const { JarvisTransferPlugin, App, Network } = Plugins;

function enableHardwareBackButton(ionRouter: UseIonRouterResult) {
    document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(-1, () => {
            if (!ionRouter.canGoBack()) {
                App.exitApp();
            }
        });
    });
}

const Welcome: React.FC = () => {

    const ionRouter = useIonRouter();

    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });

    const { downloadedCities, setDownloadedCities, clearAll } = useContext(
        MapContext
    ) as ContextMapType;
    const [present, dismiss] = useIonToast();

    const [availableCities, setAvailableCities] = React.useState<Array<string>>(new Array());

    function loadData() {
        window.location.reload();
    }

    const connection = async () => {
        var prova = await Network.getStatus();
        if (!prova.connected && downloadCity.length === 0)
            setShowPopover({ showPopover: true, event: undefined })
    }

    useEffect(() => {
        Network.addListener("networkStatusChange", status => {
            loadData();
        });
        enableHardwareBackButton(ionRouter);
        loadAvailableCities();
        connection();
    }, []);

    function loadAvailableCities() {
        var request = "http://www.lucapatarca.cloud/list/available";
        fetch(request)
            .then(response => response.json())
            .then(async data => {
                setAvailableCities(data);
            });
    }

    async function downloadCity(city_name: string) {
        connection();
        console.log("Starting download");
        await JarvisTransferPlugin.download({
            url: "http://www.lucapatarca.cloud/download/" + city_name,
        });
        console.log("Download completed");
        const newArray = downloadedCities.concat(city_name);
        setDownloadedCities(newArray);
    }

    function reset() {
        clearAll();
        try {
            JarvisTransferPlugin.reset();
            setDownloadedCities(new Array());
            present({
                buttons: [{ text: 'ok', handler: () => dismiss() }],
                message: 'rimossi tutti i dati',
                duration: 10000
            });
        } catch {
            present({
                buttons: [{ text: 'ok', handler: () => dismiss() }],
                message: 'impossibile cancellare i dati',
                duration: 10000
            });
        }
    }

    return (
        <IonPage id="home-page">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="assets/icon/splash.png" height="70 px" width="70 px" />
            </div>
            <IonList className="available-list">
                {availableCities.map((cityName) => <IonItem>
                    <IonLabel className="left-item">{cityName}</IonLabel>
                    {downloadedCities.find((e) => e == cityName) === undefined ?
                        <IonButton onClick={() => downloadCity(cityName)} className="right-item" size="default"><IonIcon icon={downloadOutline} size="default" /></IonButton>
                        : <IonIcon icon={cloudDoneOutline} className="right-item" size="large" />}
                </IonItem>)}
            </IonList>
            <IonPopover
                cssClass='my-custom-class'
                event={popoverState.event}
                isOpen={popoverState.showPopover}
                backdropDismiss={false}
            >
                ERRORE<br />
                Attivare internet
                <br />
                <IonButton onClick={() => loadData()}>reload</IonButton>
            </IonPopover>
            <IonToolbar>
                <IonButtons slot="end">
                    <IonButton disabled={downloadedCities.length === 0} color="secondary" routerLink="/home">
                        fatto
                    </IonButton>
                </IonButtons>
                <IonButtons slot="start">
                    <IonButton color="danger" size="small" onClick={() => reset()} >
                        cancella tutto
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonPage>
    );
};

export default Welcome;
