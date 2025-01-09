import { useState, useEffect } from "react";
import React from "react";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from "@mui/material/Stack";
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { ContentParser } from "./utils/parser";

const Home: React.FC = () => {
  const [words, setWords] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWords = async () => {
        setLoading(true);
        for (let i = 1; i <= 25; i++) {
            await fetch(`/languages/de/set${i}.md`)
            .then((response) => response.text())
            .then((fileContent) => {
              
              let parser = new ContentParser(fileContent);
              let parseResult = parser.parse();
              console.log(parseResult.words);
      
              setWords(map => {
                  map.set(`de/set${i}.md`, parseResult.words);
                  return map
              });        
            });  
        }    
        setLoading(false);
    }

    loadWords()
  }, []);

  if (loading) {
    return <div><b>Loading ...</b></div>
  }

  return (
    <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
      {Array.from(words.entries()).map(([lessonTitle, targetWords], index) => (        
        <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            <Card>
                <CardHeader subheader={lessonTitle} />    
                <CardContent>                
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        {Array.from(targetWords).map((w, i) => (
                            <Chip key={i} label={w} variant="outlined" />
                        ))}
                    </Stack>        
                </CardContent>                    
                <CardActions>
                    <Button
                        component={Link}
                        to={`/tooti/practice/languages/${lessonTitle}`} // Replace with your target route
                        variant="contained"
                        color="primary">
                        Practice    
                    </Button>
                </CardActions>    
            </Card>
        </Grid>           
      ))}
    </Grid>          
  );
};

export default Home;
