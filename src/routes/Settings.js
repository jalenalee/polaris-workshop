import React, {useState, useCallback} from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {
  Card,
  Page,
  Layout,
  Form,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  TextField,
  Checkbox,
  RadioButton,
  Stack,
} from '@shopify/polaris';

function Settings({loading, updateSettingsMutation}) {
  const [autoPublish, setAutoPublish] = useState(false);
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [value, setValue] = useState('disabled');

  const [textFieldValue, setTextFieldValue] = useState('temp');
  const handleTextFieldChange = useCallback(
    (newTextFieldValue) => setTextFieldValue(newTextFieldValue),
    [],
  );
  const handleChange = useCallback(
    (_checked, newValue) => setValue(newValue),
    [],
  );
  const handleFormSubmit = () => {
    // We prevent form submission when there is an error in the email field.
    if (emailError) {
      return;
    }

    // Otherwise, we use GraphQL to update the merchant's app settings.
    updateSettingsMutation({
      variables: {
        autoPublish,
        emailNotifications,
        email,
      },
    });
  };

  // While the data loads during our GraphQL request, we render skeleton content to signify to the merchant that page data is on its way.
  const loadingStateContent = loading ? (
    <Layout>
      <Layout.AnnotatedSection
        title="Auto publish"
        description="Automatically check new reviews for spam and then publish them."
      >
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Layout.AnnotatedSection>
      <Layout.AnnotatedSection
        title="Email settings"
        description="Choose if you want to receive email notifications for each review."
      >
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  ) : null;

  const settingsFormContent = !loading ? (
    <Layout>
      {/* Annotated sections are useful in settings pages to give more context about what the merchant will change with each setting. */}
      <Layout.AnnotatedSection
        title="Auto publish"
        description="Automatically check new reviews for spam and then publish"
      >
        <Stack vertical>
          <Card sectioned>
            <p>Auto publish</p>
            <RadioButton
              label="Enabled"
              helpText="New reviews are check for spam and then automatically published"
              checked={value === 'disabled'}
              id="disabled"
              onChange={handleChange}
            />
            <RadioButton
              label="Disabled"
              helpText="You must manually approve and publish new reviews"
              id="optional"
              checked={value === 'optional'}
              onChange={handleChange}
            />
          </Card>
        </Stack>
      </Layout.AnnotatedSection>
      <Layout.AnnotatedSection title="Email settings">
        <Card sectioned>
          <TextField
            label="Email"
            value={textFieldValue}
            onchange={handleTextFieldChange}
          />
          <Checkbox label="Send me an email when a review is submitted" />
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  ) : null;

  // We wrap our page component in a form component that handles form submission for the whole page. We could also handle submittal with the onClick event of the save button. Either approach works fine.
  return (
    <Form onSubmit={handleFormSubmit}>
      <Page
        title="Settings"
        breadcrumbs={[{content: 'Product reviews', url: '/'}]}
      >
        {loadingStateContent}
        {settingsFormContent}
      </Page>
    </Form>
  );
}

export default compose(
  graphql(
    gql`
      query SettingsQuery {
        settings {
          autoPublish
          emailNotifications
          email
        }
      }
    `,
    {
      name: 'settingsQuery',
    },
  ),
  graphql(
    gql`
      mutation updateSettings(
        $autoPublish: Boolean
        $emailNotifications: Boolean
        $email: String
      ) {
        updateSettings(
          autoPublish: $autoPublish
          emailNotifications: $emailNotifications
          email: $email
        ) {
          autoPublish
          emailNotifications
          email
        }
      }
    `,
    {
      name: 'updateSettingsMutation',
    },
  ),
)(Settings);
