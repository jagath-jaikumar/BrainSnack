import React from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from "@mui/base/ButtonUnstyled";
import { styled } from "@mui/system";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FadeIn from "react-fade-in";
import Grid from "@mui/material/Grid";
import MuiAlert from "@mui/material/Alert";

import Snackbar from "@mui/material/Snackbar";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const blue = {
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const CustomButtonRoot = styled("button")`
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: ${blue[500]};
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1),
      0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function CustomButton(props) {
  return <ButtonUnstyled {...props} component={CustomButtonRoot} />;
}

function QuestionCard(props) {
  React.useEffect(() => {}, [props.guesses]);
  function decode(s) {
    var elem = document.createElement("textarea");
    elem.innerHTML = s;
    return elem.value;
  }
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} gutterBottom>
          {decode(props.question)}
        </Typography>
      </CardContent>
      <CardActions>
        <ToggleButtonGroup
          color="primary"
          value={props.guesses[props.id]}
          exclusive
          onChange={(e, v) => {
            props.handleChange(e, v, props.id);
          }}
          fullWidth
        >
          <ToggleButton color="success" value="True">
            True
          </ToggleButton>
          <ToggleButton color="error" value="False">
            False
          </ToggleButton>
        </ToggleButtonGroup>
      </CardActions>
    </Card>
  );
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function GameBoard(props) {
  const [gameState, setGameState] = React.useState([]);
  const [guesses, setGuesses] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [guessesReady, setGuessesReady] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const handleSnackbar = () => setOpenSnackbar(true);
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const [answers, setAnswers] = React.useState({});

  React.useEffect(() => {
    axios
      .get("http://localhost:11000/trivia/")
      .then((response) => {
        setGameState(response.data.trivias);
        var g = {};
        var a = {};
        response.data.trivias.forEach((trivia) => {
          g[trivia.id] = null;
          a[trivia.id] = trivia.correct_answer;
        });
        setGuesses(g);
        setAnswers(a);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleChange = (event, guess, id) => {
    setGuesses({ ...guesses, [id]: guess });
  };

  React.useEffect(() => {
    // console.log(Object.values(guesses))
    if (
      Object.values(guesses).length > 0 &&
      !Object.values(guesses).includes(null)
    ) {
      setGuessesReady(true);
    } else {
      setGuessesReady(false);
    }
  }, [guesses]);

  return (
    <div>
      <Stack spacing={4}>
        {gameState.map((item, index) => {
          return (
            <QuestionCard
              key={index}
              id={item.id}
              question={item.question}
              handleChange={handleChange}
              guesses={guesses}
            />
          );
        })}
        <CustomButton disabled={!guessesReady} onClick={handleOpen}>
          Guess!
        </CustomButton>
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid
          container
          align="center"
          justifyContent="center"
          alignItems="center"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Results
            </Typography>
            <br />
            <Stack spacing={2}>
              <FadeIn delay={400}>
                {Object.keys(guesses).map((id, index) => {
                  if (guesses[id] === answers[id]) {
                    return (
                      <Typography key={index} variant="body1" component="p">
                        {`Question ${index + 1}: Correct!  ✅`}
                      </Typography>
                    );
                  } else {
                    return (
                      <Typography key={index} variant="body1" component="p">
                        {`Question ${index + 1}: Incorrect!  ❌`}
                      </Typography>
                    );
                  }
                })}
                <br />
                <Typography variant="body1" component="p">
                  {`You got ${
                    Object.values(guesses).filter(
                      (guess) => guess === answers[guess]
                    ).length
                  } out of ${Object.keys(guesses).length} questions correct`}
                </Typography>
                <br />
                <CustomButton
                  onClick={() => {
                    const timeElapsed = Date.now();
                    const today = new Date(timeElapsed);
                    var s = "";
                    Object.keys(guesses).map((id, index) => {
                      if (guesses[id] === answers[id]) {
                        s += `✅`;
                      } else {
                        s += `❌`;
                      }
                    });
                    var text = `Brain Snack ${today.toLocaleDateString()}:\n${s}`;
                    console.log(text);
                    navigator.clipboard.writeText(text);
                    handleSnackbar();
                  }}
                >
                  Share Results 🔗
                </CustomButton>
              </FadeIn>
            </Stack>
          </Box>
        </Grid>
      </Modal>
      <Snackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        message="Copied to Clipboard"
        severity="success"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Results copied!
        </Alert>
      </Snackbar>
    </div>
  );
}
