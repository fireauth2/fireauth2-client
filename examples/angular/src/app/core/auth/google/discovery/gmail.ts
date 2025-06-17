import { DiscoveryDocument, Scope } from '../../discovery-document';

export class GmailDiscoveryDocument extends DiscoveryDocument {
  static readonly canonicalName = 'Gmail';
  static readonly logoUrl = '/img/gmail-logo.png';
  static readonly description =
    'The Gmail API lets you view and manage Gmail mailbox data like threads, messages, and labels.';

  static readonly shortDescription =
    'View mailbox data like messages and labels.';
  static readonly scopes: Scope[] = [
    {
      id: 'https://mail.google.com/',
      description:
        'Read, compose, send, and permanently delete all your email from Gmail',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
      description:
        'Manage drafts and send emails when you interact with the add-on',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.addons.current.message.action',
      description: 'View your email messages when you interact with the add-on',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.addons.current.message.metadata',
      description:
        'View your email message metadata when the add-on is running',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
      description: 'View your email messages when the add-on is running',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.compose',
      description: 'Manage drafts and send emails',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.insert',
      description: 'Add emails into your Gmail mailbox',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.labels',
      description: 'See and edit your email labels',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.metadata',
      description:
        'View your email message metadata such as labels and headers, but not the email body',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.modify',
      description: 'Read, compose, and send emails from your Gmail account',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.readonly',
      description: 'View your email messages and settings',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.send',
      description: 'Send email on your behalf',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.settings.basic',
      description:
        'See, edit, create, or change your email settings and filters in Gmail',
    },
    {
      id: 'https://www.googleapis.com/auth/gmail.settings.sharing',
      description:
        'Manage your sensitive mail settings, including who can manage your mail',
    },
  ];

  static get lightweightScopes(): Scope[] {
    const scopeIds = ['https://www.googleapis.com/auth/gmail.readonly'];
    return scopeIds
      .map((id) => this.scopes.find((s) => s.id === id))
      .filter((s) => s != null);
  }
}
