import { Box , Divider, useTheme} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import {Typography} from "@mui/material";



function FeedCategories() {

  const { palette } = useTheme();
  return (
    <WidgetWrapper m="2rem 0 0">
      <Box flexDirection="column">
        <Box display="flex" justifyContent="center" mb="1rem"><Typography>FeedCategories</Typography></Box>
        <Divider />
        <FlexBetween mt="0.5rem">
          <Typography  sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}>Todo</Typography>
          <Typography  sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}>Inversiones</Typography>
          <Typography  sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}>Market</Typography>
          <Typography  sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}>Asociarse</Typography>
          <Typography  sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}>Foro</Typography>          
        </FlexBetween>
      
      </Box>
    </WidgetWrapper>
  )
}

export default FeedCategories