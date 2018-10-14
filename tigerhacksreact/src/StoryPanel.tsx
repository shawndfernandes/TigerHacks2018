import * as React from "react";
import {
  Button,
  Col,
  FormGroup,
  Input,
  // InputGroup,
  Label,
  // InputGroupAddon,
  Row
} from "reactstrap";
import { BubbleGrid } from "./Components/BubbleGrid";

import { Viewport } from "react-map-gl";
import ReactMapGL from "react-map-gl";

// import { Map, TileLayer } from "react-leaflet";

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console
// tslint:disable:jsx-no-lambda

export interface IArticle {
  title: string;
  url: string;
  urlToImage: string;
  description: string;
}

interface IStoryPanelState {
  newLocation: string;
  location: string;
  loaded: boolean;
  stories: IArticle[][];
  newStories: IArticle[][];
  viewport: Viewport;
  searchTerm: string;
}

export class StoryPanel extends React.Component<any, IStoryPanelState> {
  constructor(props: any) {
    super(props);

    this.state = {
      newLocation: "Anywhere",
      location: "Somewhere",
      loaded: false,
      stories: [],
      newStories: [],
      viewport: {
        latitude: 38.9517,
        longitude: -92.3341,
        zoom: 15
      },
      searchTerm: ""
    };
  }

  public render() {
    if (this.state.loaded) {
      // if (this.state.location !== this.state.newLocation) {
      // this.state.stories.push(...this.state.newStories);
      // }

      return (
        <div>
          <Row>
            <Col xs="6" style={{ backgroundColor: "gray" }}>
              <div>
                <Button
                  color="primary"
                  onClick={(e: any) => {
                    this.setState({
                      viewport: {
                        latitude: 40.7128,
                        longitude: -74.006,
                        zoom: 14
                      },
                      location: "New York New York"
                    });
                    this.componentDidMount();
                  }}
                >
                  New York
                </Button>
                <Button
                  color="primary"
                  onClick={(e: any) => {
                    this.setState({
                      viewport: {
                        latitude: 34.0522,
                        longitude: -118.2437,
                        zoom: 14
                      },
                      location: "Los Angeles California"
                    });
                    this.componentDidMount();
                  }}
                >
                  Los Angeles
                </Button>
                <Button
                  color="primary"
                  onClick={(e: any) => {
                    this.setState({
                      viewport: {
                        latitude: 51.5074,
                        longitude: -0.1278,
                        zoom: 14
                      },
                      location: "London England"
                    });
                    this.componentDidMount();
                  }}
                >
                  London
                </Button>
                <Button
                  color="primary"
                  onClick={(e: any) => {
                    this.setState({
                      viewport: {
                        latitude: 41.8781,
                        longitude: -87.6298,
                        zoom: 14
                      },
                      location: "Chicago Illinois"
                    });
                    this.componentDidMount();
                  }}
                >
                  Chicago
                </Button>
                <Button
                  color="primary"
                  onClick={(e: any) => {
                    this.setState({
                      viewport: {
                        latitude: 38.9517,
                        longitude: -92.3341,
                        zoom: 15
                      },
                      location: "Columbia Missouri"
                    });
                    this.componentDidMount();
                  }}
                >
                  Columbia
                </Button>
              </div>
              <ReactMapGL
                width={845}
                height={892}
                mapboxApiAccessToken="pk.eyJ1IjoiZGxrc2FmaiIsImEiOiJjam44NmhkcjYwNnliM2twZnUyem1qdG5yIn0.aX2_1Xn0BU5W6FkzThi_gQ"
                {...this.state.viewport}
                // tslint:disable-next-line:jsx-no-lambda
                onViewportChange={viewport => {
                  this.setState({ viewport });
                  this.componentDidMount();
                  // console.log(viewport);
                }}
              />
            </Col>
            <Col xs="6">
              <Row style={{ paddingTop: "10px" }}>
                <Col md={1}>
                  <FormGroup style={{ paddingTop: "10px", width: "100px" }}>
                    <Label for="searchTerm">NÜZVÜZ:</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      type="text"
                      name="searchTerm"
                      id="searchTerm"
                      // placeholder="with a placeholder"
                      // tslint:disable-next-line:jsx-no-lambda
                      value={this.state.searchTerm}
                      onChange={e => {
                        this.setState({ searchTerm: e.target.value });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md={5}>
                  <Button
                    color="primary"
                    onClick={(e: any) => {
                      this.componentDidMount();
                    }}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
              <Row
                style={{
                  display: "flex",
                  flexFlow: "row wrap",
                  backgroundColor: "eggshell",
                  padding: "10px"
                }}
              >
                {this.state.newStories.map((articles: IArticle[]) => {
                  return (
                    <div style={{ width: "33%" }} key={"alefjlajf"}>
                      <BubbleGrid data={articles} />
                    </div>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </div>
      );
    }

    return <p>Loading...</p>;
  }

  public componentDidMount() {
    fetch(
      "http://ec2-52-200-77-175.compute-1.amazonaws.com:8080/api/articles?lat=" +
        this.state.viewport.latitude +
        "&lon=" +
        this.state.viewport.longitude +
        "&content=" +
        this.state.searchTerm,
      {
        mode: "cors"
      }
    )
      .then(response => response.json())
      .then(data => {
        if (data.locationString !== this.state.location) {
          const stories: IArticle[][] = [];

          for (let i = 0; i < data.relativeArticles.length; i++) {
            if (stories[Math.floor(i / 9)] === undefined) {
              stories[Math.floor(i / 9)] = [];
            }
            stories[Math.floor(i / 9)].push(data.relativeArticles[i]);
          }
          data.trendingArticles.forEach((article: IArticle) => {
            stories.push([article]);
          });
          shuffle(stories);

          this.setState({
            loaded: true,
            newStories: stories,
            location: data.locationString
            // newLocation: data.locationString
          });
        }
      });
  }
}

function shuffle(array: any[]) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
