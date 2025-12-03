import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function NewsLetter() {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_ORIGIN+"/api/news") // 👈 Your backend API
      .then((res) => res.json())
      .then((data) => setNewsItems(data))
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  // Duplicate news array to allow infinite scroll effect
  const loopedNews = [...newsItems, ...newsItems];

  // Split into multiple rows (2 sections)
  const rows = 1;
  const chunkSize = Math.ceil(loopedNews.length / rows);
  const newsRows = Array.from({ length: rows }, (_, i) =>
    loopedNews.slice(i * chunkSize, (i + 1) * chunkSize)
  );

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        overflow: "hidden",
      }}
    >
      {newsRows.map((row, rowIdx) => (
        <Box
          key={rowIdx}
          sx={{
            width: "100%",
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&:hover .scroll-container": {
              animationPlayState: "running",
            },
          }}
        >
          <Box
            className="scroll-container"
            sx={{
              display: "flex",
              gap: 2,
              width: "max-content",
              animation: "scroll-left 40s linear infinite",
              animationPlayState: "paused",
            }}
          >
            {row.map((item, idx) => (
              <Box
                key={idx}
                onClick={() => window.open(item.link, "_blank")}
                sx={{
                  flex: "0 0 300px",
                  minWidth: 300,
                  height: 250,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  boxShadow: 2,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  p: 2,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      {/* CSS Keyframes for infinite auto-scroll */}
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </Card>
  );
}
