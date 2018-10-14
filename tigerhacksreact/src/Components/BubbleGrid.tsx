// tslint:disable:object-literal-sort-keys

import * as React from "react";
import {
  Card,
  CardBody,
  CardImg,
  // CardSubtitle,
  // CardText,
  CardTitle,
  Media
} from "reactstrap";
import { IArticle } from "./../StoryPanel";
import FixedAspectRatio from "./FixedAspectRatio";

interface IBubbleGrid {
  data: IArticle[];
}

export const BubbleGrid = (props: IBubbleGrid) => {
  if (props.data.length === 1) {
    return (
      <FixedAspectRatio className="bubbleGrid" ratio="1:1">
        <Card
          style={{
            width: "96%",
            height: "96%",
            display: "flex",
            flexFlow: "col nowrap",
            // background: "red",
            borderRadius: "20px",
            alignItems: "center",
            justifyContent: "center",
            margin: "2%"
          }}
        >
          <a href={props.data[0].url} target="_blank">
            <CardImg
              top={true}
              width="100%"
              src={props.data[0].urlToImage}
              style={{
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                marginTop: "-1px",
                maxHeight: "150px",
                minHeight: "150px",
                objectFit: "cover"
              }}
            />
          </a>

          <CardBody style={{ overflow: "hidden" }}>
            <CardTitle>{props.data[0].title}</CardTitle>
            {/* <CardText>{props.data[0].description}</CardText> */}
          </CardBody>
        </Card>
      </FixedAspectRatio>
    );
  }
  return (
    <FixedAspectRatio ratio="1:1">
      <div
        className="bubbleGrid"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          height: "100%"
        }}
      >
        {props.data.map(bubbleData => (
          <div
            className="relativeStory"
            style={{
              width: "30%",
              height: "30%",
              display: "flex",
              background: "red",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              margin: "1.5%"
            }}
          >
            <a
              href={bubbleData.url}
              target="_blank"
              style={{ height: "100%", width: "100%" }}
            >
              <Media
                src={bubbleData.urlToImage}
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  minWidth: "100%",
                  minHeight: "100%",
                  maxWidth: "100%",
                  maxHeight: "100%"
                }}
              />
            </a>
          </div>
        ))}
      </div>
    </FixedAspectRatio>
  );
};
