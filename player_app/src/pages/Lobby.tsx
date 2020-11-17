import React from 'react';
import {connect} from "react-redux";
import {IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar} from "@ionic/react";

interface LobbyProps {

}

const Lobby : React.FC<LobbyProps> = (props) => {
  return <IonPage>
    <IonToolbar>
      <IonTitle>Waiting for Game Start</IonTitle>
    </IonToolbar>
  </IonPage>;
}

export default connect()(Lobby);