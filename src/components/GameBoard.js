import React from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function GameBoard(props) {
  const [gameState, setGameState] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("http://localhost:11000/trivia/")
      .then((response) => {
        setGameState(response.data.trivias);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function decode(s) {
    var elem = document.createElement("textarea");
    elem.innerHTML = s;
    return elem.value;
  }

  return (
    <div>
      <Stack spacing={4}>
        {gameState.map((item, index) => {
          return (
            <Card key={index}>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} gutterBottom>
                  {decode(item.question)}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </div>
  );
}
