// "AYOUB FARAHI"

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : "http://localhost:3000"


export default function WelcomeTemplate({ projectNumber, nameSubcontractor, projectName, projectDate, projectCategory, generalDetails, clientPreferences, streetName, number, postalcode, city, country, partsOfthehouse, floorNumber }) {


  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Row>
              <Column style={headerContent}>
                {/* This is the subject  */}
                <Text style={headerContentSubtitle}>
                  Subject
                </Text>

                <Heading style={headerContentTitle}>
                  Collaboration proposal accepted!
                </Heading>

                {/* This is the subject  */}
                <Text style={headerContentSubtitle}>
                  Project number
                </Text>

                <Heading style={headerContentTitle}>
                  {projectNumber}
                </Heading>

              </Column>

              <Column style={headerImageContainer}>
                <Img
                  style={headerImage}
                  width={200}
                  src="cid:logo"
                />


              </Column>
            </Row>
          </Section>

          <Section style={content}>

            <Heading as="h2" style={title}>
              Dear GreenTeam
            </Heading>
            <Text style={paragraph}>
              We are excited to let you know that {nameSubcontractor} has accepted to collaborate with you on project {projectNumber}.
            </Text>

            <Hr style={divider} />



            {/* Project details title  */}
            <Heading as="h2" style={title}>
              Project details
            </Heading>

            {/* #### All project details  */}

            {/* Table Number 1 */}
            <Section style={borderStyle}>
              <Row>
                <Column>

                  {/* projectNumber */}
                  <Text>
                    <span style={labelStyle}>Project number:</span>
                    {projectNumber}
                  </Text>

                </Column>
              </Row>
              <Row>
                <Column>

                  {/* projectName */}
                  <Text>
                    <span style={labelStyle}>Project name:</span>
                    {projectName}
                  </Text>

                </Column>
              </Row>
              <Row>
                <Column>

                  {/* projectDate */}
                  <Text>
                    <span style={labelStyle}>Project date:</span>
                    {projectDate} - {projectDate}
                  </Text>

                </Column>
              </Row>
            </Section>


            {/* Table Number 2 */}
            <Section style={borderStyle}>
              <Row>
                <Column>

                  {/* projectCategory */}
                  <Text>
                    <span style={labelStyle}>Project category:</span>
                    {projectCategory}
                  </Text>

                </Column>
              </Row>
              <Row>
                <Column>

                  {/* generalDetails */}
                  <Text>
                    <span style={labelStyle}>General details:</span>
                    {generalDetails}
                  </Text>

                </Column>
              </Row>
              <Row>
                <Column>

                  {/* clientPreferences */}
                  <Text>
                    <span style={labelStyle}>Client preferences:</span>
                    {clientPreferences}
                  </Text>

                </Column>
              </Row>
            </Section>



            <Text style={paragraph}>
              Good luck!
            </Text>


            <Img
              style={headerImage}
              width={120}
              // src={`${baseUrl}/colored-logo.png`}
              src="cid:colored-logo"

            />

          </Section>
        </Container>

      </Body>
    </Html>

  )
};


const main = {
  backgroundColor: "#f3f3f5",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const headerContent = { padding: "20px 30px 15px" };

const headerContentTitle = {
  color: "#fff",
  fontSize: "23px",
  fontWeight: "bold",
  lineHeight: "27px",
};


const borderStyle = {
  border: '2px solid #FED7AA',
  borderRadius: '4px',
  padding: '5px',
  marginBottom: '16px',
  backgroundColor: "#F569001A"
};


const labelStyle = {
  fontWeight: 'bold',
  width: '150px',
  display: 'inline-block',
};

const headerContentSubtitle = {
  color: "#fff",
  fontSize: "17px",
};

const headerImageContainer = {
  padding: "30px 10px"
};

const headerImage = {
  maxWidth: "100%",
};

const title = {
  margin: "0 0 15px",
  fontWeight: "bold",
  fontSize: "18px",
  lineHeight: "21px",
  color: "#0c0d0e",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "21px",
  color: "#3c3f44",
};

const divider = {
  margin: "30px 0",
};

const container = {
  width: "680px",
  maxWidth: "100%",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const content = {
  padding: "30px 30px 40px 30px",
};


const header = {
  borderRadius: "5px 5px 0 0",
  display: "flex",
  flexDireciont: "column",
  backgroundColor: "#217946",
};
