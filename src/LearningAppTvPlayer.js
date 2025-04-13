import React from 'react';
import styled from 'styled-components'; // Optional: If using styled-components

interface LearningAppTVPlayerProps {
  apkLink?: string;
}

const LearningAppTVPlayer: React.FC<LearningAppTVPlayerProps> = ({
  apkLink = '/data/alearningapp-v1.0.apk',
}) => {
  return (
    <Container>
      <Title>A Learning App TV</Title>
      <Description>
        A joyful Android TV app for kids and worry-free parents.  Children easily choose parent-approved shows using a
        simple remote. Add safe videos or playlists from your trusted web video links, or IPTV—all while blocking unapproved content for a
        secure, fun experience.
      </Description>
      <FeaturesSection>
        <FeaturesTitle>Why You'll Love It</FeaturesTitle>
        <FeaturesList>
          <FeatureItem>
            <strong>Parent-Controlled Media</strong>: support add personal videos URLs.
          </FeatureItem>
          <FeatureItem>
            <strong>Safe IPTV Playlists</strong>: Include approved M3U playlists
            for worry-free streaming.
          </FeatureItem>
          <FeatureItem>
            <strong>Kid-Friendly Design</strong>: One-tap navigation with no
            confusing menus.
          </FeatureItem>
          <FeatureItem>
            <strong>Maximum Safety</strong>: Every video is choose by you to keeping kids protected.
          </FeatureItem>
        </FeaturesList>
      </FeaturesSection>
      <DownloadButton href={apkLink} download aria-label="Download A Learning App TV">
        Download Now
      </DownloadButton>
    </Container>
  );
};

// Styled-components for better maintainability
const Container = styled.section`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;

  @media (max-width: 600px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #343a40;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #495057;
  line-height: 1.6;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const FeaturesSection = styled.div`
  margin-bottom: 2rem;
`;

const FeaturesTitle = styled.h2`
  font-size: 1.8rem;
  color: #343a40;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 0.75rem;
  line-height: 1.5;

  strong {
    color: #007bff;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const DownloadButton = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  color: #fff;
  background-color: #007bff;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid #0056b3;
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
`;

export default LearningAppTVPlayer;