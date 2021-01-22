import React from 'react';
import {User} from "../../domain/User";
import {AvatarGroup} from "@material-ui/lab";
import {Avatar, makeStyles} from "@material-ui/core";
import {lime} from "@material-ui/core/colors";

interface PlayerAvatarGroupProps {
  players: User[] | undefined,
  maxAvatars?: number
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    background: lime[500],
    fontColor: "#FFFFFF",
  },
  avatarGroup: {
    display: 'flex',
    alignItems: "center"
  }
}));

const PlayerAvatarGroup: React.FC<PlayerAvatarGroupProps> = ({players, maxAvatars}) => {
  const classes = useStyles();

  return (
    <AvatarGroup className={classes.avatarGroup} spacing="small">
      {
        players?.map((player) => (
          <Avatar className={classes.avatar} src="/broken-image.png" alt={player.name} />
        ))
      }
    </AvatarGroup>
  );
}

export default PlayerAvatarGroup;