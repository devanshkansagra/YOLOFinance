import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Slider from 'react-slick';
import Box from '@mui/material/Box';

const newsItems = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Market Update',
    description: 'Stocks rallied today as investors reacted to positive economic news.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Mutual Funds Insights',
    description: 'Top performing mutual funds this month revealed.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Investment Tips',
    description: 'How to diversify your portfolio for better returns.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Banking News',
    description: 'Latest updates from the banking sector and RBI policies.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Crypto Watch',
    description: 'Bitcoin and Ethereum prices surge amid global adoption.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Economic Outlook',
    description: 'IMF revises India’s growth forecast for the coming year.',
  },
];


const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

export default function NewsLetter() {
  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        minHeight: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          p: 2,
          overflowX: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: 'max-content',
          }}
        >
          {newsItems.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                flex: '0 0 300px',
                minWidth: 300,
                height: 250,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                boxShadow: 1,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  padding: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
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
    </Card>
);}