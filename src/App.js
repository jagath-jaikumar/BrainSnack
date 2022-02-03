import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import HeaderBar from "./components/HeaderBar";
import GameBoard from "./components/GameBoard";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

function App() {
  return (
    <>
      <CssBaseline />

      <Grid
        container
        align="center"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={{
            width: 300,
          }}
        >
          <Stack spacing={2}>
            <HeaderBar />
            <GameBoard />
          </Stack>
          <br />
        </Box>
      </Grid>
    </>
  );
}

export default App;
