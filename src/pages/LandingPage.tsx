import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PhoneImageContainer from "../assets/landingPage/Phone-Image-Container.png";
import { Header } from "@/components";
import WhyChooseSkillSwap from "@/components/LandingPage/WhyChooseSkillSwap";
const LandingPage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <WhyChooseSkillSwap />
    </>
  );
};

export default LandingPage;

const HeroSection = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 2,
        bgcolor: "#F5F7FA",
        height: 900,
      }}
    >
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          "@media (max-width:600px)": {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        {/* Text Section */}
        <Grid size={6}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="max-w-2xl text-left px-6">
              <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
                A Community for Shared Learning
              </h1>

              <p className="mb-8 text-lg text-gray-600 text-left">
                Connect with people to exchange skills and learn together
              </p>

              <button
                className="rounded-lg bg-blue-600 px-8 py-3 text-white font-medium
                           transition hover:bg-blue-700 focus:outline-none
                           focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Get Started
              </button>
            </div>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid size={6}>
          <Box
            sx={{
              height: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={PhoneImageContainer}
              alt="phone-image-container"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
