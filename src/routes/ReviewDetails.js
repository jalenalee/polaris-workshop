import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {
  Avatar,
  Badge,
  Card,
  TextStyle,
  Page,
  Layout,
  Stack,
  Thumbnail,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
} from '@shopify/polaris';

import NotFound from './NotFound';
import Rating from '../components/Rating';

function ReviewDetails(props) {
  const {
    data: {loading, review},
  } = props;
  const badge =
    review.status === 'published' ? (
      <Badge status="success">Published</Badge>
    ) : (
      <Badge status="attention">Unpublished</Badge>
    );
  if (loading) {
    return (
      <SkeletonPage>
        <Layout>
          <Layout.Section>
            <Card title="Review" sectioned>
              <Stack verticle>
                <Avatar customer name={review.customer.name} />
                <p>{review.customer.name}</p>
                {badge}
                <Rating value={review.rating} />
                <p>{review.content}</p>
              </Stack>

              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  if (!review) {
    return <NotFound />;
  }

  return (
    <Page
      title={review.title}
      breadcrumbs={[{content: 'All reviews', url: '/'}]}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <Stack alignment="center" distribution="equalSpacing">
                <Stack alignment="center">
                  <Thumbnail
                    source="https://cdn.shopify.com/s/files/1/1602/3257/products/paste-prod_thumb.jpg"
                    alt=""
                    size="medium"
                  />
                  <TextStyle variation="strong">
                    {review.product.name}
                  </TextStyle>
                </Stack>
                <Stack.Item fill>
                  <p>{review.customer.name}</p>
                </Stack.Item>
                <Stack>
                  <Rating value={review.product.averageRating} />
                  <p>{review.product.reviewCount} reviews</p>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default graphql(
  gql`
    query ReviewQuery($id: Int!) {
      review(id: $id) {
        id
        rating
        title
        content
        status
        date
        customer {
          name
          email
        }
        product {
          name
          reviewCount
          averageRating
        }
      }
    }
  `,
  {
    options: ({
      match: {
        params: {id},
      },
    }) => ({variables: {id: parseInt(id, 10)}}),
  },
)(ReviewDetails);
