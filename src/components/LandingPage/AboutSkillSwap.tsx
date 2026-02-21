import { Box, Grid } from "@mui/material";
import rafiki from "../../assets/landingPage/rafiki.png";

const AboutSkillSwap = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 2,
        bgcolor: "#F5F7FA",
      }}
    >
      <Grid
        container
        rowSpacing={2}
        sx={{
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        {/* Text Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={rafiki} alt="rafiki" className="object-fill" />
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: {
                xs: "center",
                md: "left",
              },
            }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
              About SkillSwap
            </h2>
            <p>
              An app that connects people to exchange skills and knowledge in a
              simple way, allowing users to learn for free or by exchanging
              skills, without complexity or financial costs.
            </p>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutSkillSwap;
