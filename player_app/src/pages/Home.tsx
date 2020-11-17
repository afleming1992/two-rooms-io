import {IonButton, IonContent, IonInput, IonItem, IonLoading, IonPage, IonCard, IonToast} from '@ionic/react';
import React, {useState} from 'react';
import './Home.css';
import {connect} from "react-redux";
import {Action, bindActionCreators, Dispatch} from "redux";
import actionCreators from "../redux/actions/creators";

interface HomeProps {
  joining: boolean,
  joinGame: any,
  isErrors: boolean,
  errorMessage: string
}

const Home: React.FC<HomeProps> = (props) => {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleJoinGame = (e: any) => {
    props.joinGame(name);
  }

  const dismissError = () => {

  }

  return (
    <IonPage>
      <IonToast
        isOpen={props.isErrors}
        onDidDismiss={() => dismissError()}
        message={props.errorMessage}
        color="danger"
        position="top"
      />
      <IonLoading isOpen={props.joining} message={"Joining Game..."} />
      <IonContent fullscreen>
        <div className="header">
            <h1>Two Rooms and a Boom!</h1>
            <IonCard>

            </IonCard>
            <IonItem>
                <IonInput value={name} placeholder="Name" onIonChange={e => setName(e.detail.value!)} />
            </IonItem>
            {/*<IonItem>*/}
            {/*    <IonInput value={joinCode} placeholder="Join Code" onIonChange={e => setJoinCode(e.detail.value!)} />*/}
            {/*</IonItem>*/}
            <IonButton onClick={ e => handleJoinGame(e) } className="joinGameButton">Join Game</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

const mapStateToProps = (state: any) => {
    return {
      joining: state.player.joining,
      isErrors: state.errors.isOpen,
      errorMessage: state.errors.error
    }
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    joinGame: actionCreators.joinGame
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);