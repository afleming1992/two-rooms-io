import React from "react";
import { Input, Page, Button } from "react-onsenui";
import { connect } from "react-redux";
import './Home.css';

interface HomeProps {

}

const Home: React.FC<HomeProps> = (props) => (
  <Page>
    <div className="header">
      <h1>Two Rooms and a BOOM</h1>
    </div>
    <div>
      <Input className='input' placeholder="Name"/>
      <Button modifier="large--cta">Testing</Button>
    </div>
  </Page>
);

const mapStateToProps = (state: any) => {
    return {

    }
}

export default connect(mapStateToProps)(Home);