import React from 'react';
import {Button, makeStyles, Menu, MenuItem, Typography} from "@material-ui/core";
import {AppState} from "../../redux/reducers";
import {connect, useDispatch} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import {Card} from "../../domain/Card";
import {revealPlayerAssignment} from "../../redux/actions/gameActionCreators";

interface EndGameNavBarProps {
  isHost: boolean,
  deck: Card[] | undefined
}

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    display: 'block'
  }
}));

const EndGameNavBar: React.FC<EndGameNavBarProps> = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleRevealMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseRevealMenu = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <Typography className={classes.title} variant="h6" noWrap>
        <FontAwesomeIcon icon={faTrophy} /> Game Results
      </Typography>
      {
        props.isHost &&
          <div>
            <Button onClick={handleRevealMenu}>Reveal</Button>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={open}
              onClose={handleCloseRevealMenu}
              id="revealmenu-appbar">
                {
                  props.deck?.map((card) => {
                    return (
                      <MenuItem onClick={() => dispatch(revealPlayerAssignment(card.key))}>{ card.title }</MenuItem>
                    );
                  })
                }
            </Menu>
          </div>
      }
    </>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    isHost: state.game.host?.userToken === state.player.userToken,
    deck: state.game.deck
  }
}

export default connect(mapStateToProps)(EndGameNavBar);