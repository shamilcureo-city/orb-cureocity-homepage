/** Public help and information pages. Legal text is never inferred from the preview. */
export function createHelpPages(ctx) {
  const { config, annualPrice, billingCopy, escape, hero, section, cards, faq, button, link, notice, cta } = ctx;
  const hasDestination = key => {
    try { const url = new URL(config.destinations[key]); return url.protocol === 'https:'; } catch { return false; }
  };
  const helpGroups = [
    { id: 'getting-started', title: 'Getting started', items: [
      { q: 'What can I try for free?', a: 'The starting-point offers are a free diet plan and a guided fitness assessment. Their live entry links, eligibility and account requirements still need confirmation. Ongoing Free and Pro app inclusions are being confirmed separately.' },
      { q: 'Where can I download Orb?', a: 'Use Get Orb to check the available App Store and Google Play destinations. Verified store listings are not yet connected to this preview, so opening the panel does not start a download or create an account.' },
      { q: 'Do I need a wearable?', a: 'No. You can begin with your goals, existing records and everyday habits. Device information adds context where supported; check the compatibility information before connecting a device.' },
      { q: 'What can I do on this website?', a: 'Explore the app experience, plans and service options. Product screens and conversations are illustrative. The website does not open your personal health records, create an Orb meal plan or book an appointment.' }
    ] },
    { id: 'plans-and-care', title: 'Plans and professional care', items: [
      { q: 'What is the annual Pro price?', a: `The confirmed annual preview price is ${annualPrice}/year. ${billingCopy} This does not establish a monthly payment option. Taxes, renewal and cancellation terms still need confirmation.` },
      { q: 'What is included in Pro?', a: 'Pro is presented for personalised plans and deeper insights. The precise meal-planning, workout, daily-insight and CGM differences, eligibility and limits are awaiting commercial confirmation. Review the Plans page before choosing.' },
      { q: 'Are consultations included in my app plan?', a: 'Professional care is optional and purchased separately from the Orb app plan. Confirm the professional, consultations, follow-up, price and location included in the service you choose.' },
      { q: 'Is Blueprint the same as a hub membership?', a: 'No. Blueprint is an assessment experience bringing relevant information into consultations, findings and next steps. Hub services relate to in-person assessment or training. Package and membership details must be confirmed separately.' },
      { q: 'Where are online and in-person services available?', a: 'Availability depends on your location and the selected service. Verified service areas, hub locations and booking destinations are not yet connected to this preview. Visit the Care, Blueprint and Hubs pages for the current information.' }
    ] },
    { id: 'information-and-control', title: 'Your information and controls', items: [
      { q: 'Can I use reports I already have?', a: 'The illustrated Health Vault experience brings reports together with their original files, dates and sources. Supported formats, extraction and sharing controls must be checked in the released app. No report is uploaded on this website.' },
      { q: 'How does Family Circle sharing work?', a: 'The preview illustrates sharing selected summaries with people you trust. Actual invitation, permission and access-removal controls still need release confirmation. The website does not invite anyone or share health information.' },
      { q: 'Does Orb replace my doctor?', a: 'No. Orb supports understanding, organisation and everyday planning. Diagnosis, clinical assessment and treatment decisions belong with appropriately qualified professionals.' },
      { q: 'Does the voice trial save my workout?', a: 'No. The website trial lets you review a draft on the current page. The microphone starts only after you choose to start it, and your browser may send audio to its speech provider. You can also type. Nothing is saved to an Orb account by this trial.' },
      { q: 'How do I request access, correction or deletion?', a: 'Use the authorized request process once its destination is available. The Data requests page currently explains its status. No request is submitted here, and the approved identity-verification and handling process still needs confirmation.' }
    ] }
  ];
  const totalQuestions = helpGroups.reduce((sum, group) => sum + group.items.length, 0);
  const groupMarkup = helpGroups.map(group => `<section class="core-help-group" id="${group.id}" data-help-group aria-labelledby="${group.id}-title"><h3 id="${group.id}-title">${escape(group.title)}</h3><div class="core-faq">${group.items.map(item => `<details data-help-item><summary>${escape(item.q)}</summary><div><p>${escape(item.a)}</p></div></details>`).join('')}</div></section>`).join('');
  const helpSearch = `<div class="core-help-search"><label for="help-search">Search the answers</label><div class="core-help-search-field"><input id="help-search" data-help-search type="search" placeholder="Try plans, reports or voice" autocomplete="off" aria-describedby="help-search-status"><button type="button" data-help-clear hidden>Clear search</button></div><p class="core-help-status" id="help-search-status" data-help-status role="status" aria-live="polite">${totalQuestions} answers to explore.</p></div><nav class="core-help-topics" aria-label="Help topics">${helpGroups.map(group => `<a href="#${group.id}">${escape(group.title)}</a>`).join('')}</nav><p class="core-help-empty" data-help-empty hidden>No matching answers. Try another word or explore the contact options below.</p>${groupMarkup}`;
  const help = {
    slug: 'help', title: 'Help and contact', description: 'Find answers about Orb, plans, records and optional professional care. Check the current support and contact options.',
    body: hero({eyebrow: 'Help & contact', title: 'A clearer answer.<br>A simpler next step.', copy: 'Find your way around Orb, understand your options and know where to go next.', actions: link('Explore the answers', '#answers', 'button-white') + link('Contact options', '#contact', 'button-outline'), theme: 'help'}) +
      section({id: 'answers', title: 'What would you like to know?', copy: 'Explore answers by topic, or search for the detail you need.', body: helpSearch}) +
      section({id: 'explore', title: 'Choose the right place to begin.', copy: 'A little more detail, before you decide.', tone: 'soft', body: cards([
        {title: 'Plans & pricing', copy: 'Review the annual app price and the Free and Pro information being confirmed.', action: link('Explore plans', '/plans/')},
        {title: 'Care & assessment', copy: 'Understand professional care, Blueprint and how they connect with Orb.', action: link('Explore care', '/care/')},
        {title: 'Devices & information', copy: 'Check the status of supported wearables, glucose sources and other inputs.', action: link('Explore integrations', '/integrations/')}
      ])}) +
      section({id: 'contact', title: 'Find the right kind of support.', copy: 'App questions, service enquiries and information requests have different next steps.', body: cards([
        {title: 'Help with Orb', copy: hasDestination('supportUrl') ? 'Open the available support destination for app-related questions.' : 'The approved app-support channel is not connected to this preview. Browse the answers above while it is being confirmed.', action: button('Check support options', 'support')},
        {title: 'Contact Cureocity', copy: hasDestination('contactUrl') ? 'Use the available contact destination for general enquiries.' : 'The approved general-enquiry destination is awaiting confirmation. No enquiry is sent from this page.', action: button('Check contact options', 'contact')},
        {title: 'Your health information', copy: 'Check the status of the authorized access, correction and deletion request process.', action: link('View data requests', '/data-requests/')}
      ]) + notice('No message has been sent', 'Opening a contact option or reading an answer does not submit an enquiry or book an appointment. Use the connected service only when its destination is available.')})
  };

  const policyAvailable = hasDestination('privacyUrl');
  const privacy = {
    slug: 'privacy', title: 'Privacy information', description: 'Check the publication status of the Orb privacy policy and find related help and data-request information.',
    body: hero({eyebrow: 'Privacy information', title: 'Your information.<br>Clear choices.', copy: 'Find the privacy information that applies to the Orb experience you use.', actions: policyAvailable ? button('Read the policy', 'privacy', 'button-white') : link('View publication status', '#policy-status', 'button-white'), theme: 'document'}) +
      section({id: 'policy-status', title: 'Privacy policy status', body: notice(policyAvailable ? 'Policy destination available' : 'Approved policy awaiting publication', policyAvailable ? 'The privacy-policy destination is connected. Read the linked document for the applicable information practices and any stated effective date.' : 'The approved Orb privacy policy has not been connected to this preview. This page is a publication-status page, not the final privacy policy. No effective date or policy terms are being represented here.') + (policyAvailable ? `<div class="core-actions">${button('Open the privacy policy', 'privacy')}</div>` : '')}) +
      section({id: 'privacy-context', title: 'Know which experience you are using.', copy: 'Information shown in a website example is different from information in your Orb account.', tone: 'soft', body: cards([
        {title: 'Website examples', copy: 'The app screens and conversations here are illustrative. This page does not open an account, upload a report or share a health summary.', action: link('Explore Orb', '/#features')},
        {title: 'App information & sharing', copy: 'Before adding or sharing information in Orb, review the controls and policy available in the released app. This preview does not establish those controls.', action: link('Read the help answers', '/help/#information-and-control')},
        {title: 'Information requests', copy: 'The authorized request route and its handling process are awaiting confirmation. Check its current status before taking the next step.', action: link('View data requests', '/data-requests/')}
      ])}) +
      section({id: 'privacy-questions', title: 'Questions about this page', body: faq([
        {q: 'Is this the final Orb privacy policy?', a: policyAvailable ? 'This page links to the configured policy destination. Read that document for its scope and terms.' : 'No. The approved policy is awaiting publication. The explanations on this page are not a substitute for the final policy.'},
        {q: 'Can I send a report or a privacy request here?', a: 'No. This page has no report-upload or request-submission form. The authorized data-request route is listed separately when available.'},
        {q: 'Where can I find the terms of use?', a: 'The Terms of use page shows the current publication status. Its approved document is separate from the privacy policy.'}
      ])}) + cta({title: 'Find the information you need.', copy: 'Explore the related pages and the current contact options.', actions: link('Terms of use', '/terms/', 'button-white') + link('Help & contact', '/help/#contact', 'button-outline')})
  };

  const termsAvailable = hasDestination('termsUrl');
  const terms = {
    slug: 'terms', title: 'Terms of use', description: 'Check the publication status of the Orb terms of use and the distinction between the app plan and optional professional services.',
    body: hero({eyebrow: 'Terms of use', title: 'Understand your choice.<br>Before your next step.', copy: 'Review the terms that apply to the app plan or service you choose.', actions: termsAvailable ? button('Read the terms', 'terms', 'button-white') : link('View publication status', '#terms-status', 'button-white'), theme: 'document'}) +
      section({id: 'terms-status', title: 'Terms publication status', body: notice(termsAvailable ? 'Terms destination available' : 'Approved terms awaiting publication', termsAvailable ? 'The terms destination is connected. Read the linked document for the scope, conditions and any stated effective date that apply to your experience.' : 'The approved Orb terms of use have not been connected to this preview. This is a publication-status page, not a final agreement. Subscription, renewal, cancellation and other applicable conditions still need approved wording.') + (termsAvailable ? `<div class="core-actions">${button('Open the terms of use', 'terms')}</div>` : '')}) +
      section({id: 'choose-experience', title: 'Different choices. Different details.', copy: 'Review the information for the experience you are considering.', tone: 'soft', body: cards([
        {title: 'The Orb app plan', copy: `The confirmed annual preview price is ${annualPrice}/year. ${billingCopy} Final inclusions, tax treatment, renewal and cancellation terms are awaiting confirmation.`, action: link('Review plans', '/plans/')},
        {title: 'Professional care', copy: 'Optional professional services are purchased separately. Confirm the consultations, follow-up, price and availability of the selected service.', action: link('Explore care', '/care/')},
        {title: 'Blueprint & hubs', copy: 'An assessment package and an in-person hub membership are separate choices. Review what is included before entering a booking flow.', action: link('Explore Blueprint', '/blueprint/')}
      ])}) +
      section({id: 'terms-questions', title: 'Before you choose', body: faq([
        {q: 'Can I buy a subscription from this preview?', a: 'No. No payment or subscription is started on this website. The approved app plan-selection destination still needs to be connected.'},
        {q: 'Does the monthly equivalent mean monthly billing?', a: `No. The displayed ${annualPrice} price is annual. The monthly equivalent explains that annual amount; it is not a monthly payment option.`},
        {q: 'Are trial or refund conditions confirmed?', a: 'No trial or refund conditions have been established for this preview. Review the applicable approved terms when the purchasing destination is available.'}
      ])}) + cta({title: 'Keep your next step informed.', copy: 'Review the available plan information or find the current contact options.', actions: link('Explore plans', '/plans/', 'button-white') + link('Help & contact', '/help/#contact', 'button-outline')})
  };

  const requestsAvailable = hasDestination('dataRequestsUrl');
  const dataRequests = {
    slug: 'data-requests', title: 'Data requests', description: 'Find the status of the authorized Orb information-request channel and understand where to begin.',
    body: hero({eyebrow: 'Data requests', title: 'Your information.<br>Your next step.', copy: 'Find the authorized route for a request about your Orb information.', actions: requestsAvailable ? button('Open the request process', 'data-requests', 'button-white') : link('View request availability', '#request-status', 'button-white'), theme: 'document'}) +
      section({id: 'request-status', title: 'Request channel status', body: notice(requestsAvailable ? 'Request destination available' : 'Authorized request channel awaiting confirmation', requestsAvailable ? 'Use the connected request process for its instructions and any required verification. Opening this page does not submit a request.' : 'The approved access, correction and deletion request destination is not connected to this preview. The handling process and identity-verification instructions also need confirmation. No request can be submitted on this page.') + (requestsAvailable ? `<div class="core-actions">${button('Continue to the request process', 'data-requests')}</div>` : '')}) +
      section({id: 'request-types', title: 'What would you like help with?', copy: 'These describe the type of request to discuss through the authorized process. Available options depend on that process and the relevant information.', tone: 'soft', body: cards([
        {title: 'Access to information', copy: 'Identify the account information or records you are asking about, then follow the instructions in the authorized request channel.'},
        {title: 'Correcting information', copy: 'Identify the detail you believe needs correction. Use the approved process to provide the relevant context and any requested verification.'},
        {title: 'Deleting information', copy: 'Explain the information or account you want to ask about. Read the applicable process for its scope, conditions and next steps.'}
      ])}) +
      section({id: 'request-guidance', title: 'Before using a request channel', body: `<div class="core-document"><ol class="core-request-steps"><li><h3>Check the destination</h3><p>Use the authorized Orb process once it is available. The website preview is not a place to upload identity documents or health records.</p></li><li><h3>Follow the stated instructions</h3><p>Provide the information and verification requested by that process. This preview does not define verification requirements or response times.</p></li><li><h3>Look for confirmation there</h3><p>A request is submitted only when the connected service confirms it. Keep any confirmation or reference it provides.</p></li></ol></div>`}) +
      section({id: 'request-questions', title: 'Questions about requests', tone: 'soft', body: faq([
        {q: 'Has opening this page submitted a request?', a: 'No. Reading this page or opening a destination panel does not submit an access, correction or deletion request.'},
        {q: 'Can I send my health documents here?', a: 'No. This page does not accept documents or personal information. Use only the instructions provided by an authorized request service when it becomes available.'},
        {q: 'How long will a request take?', a: 'No response time is established by this preview. Check the approved process for its handling information once it is available.'}
      ])}) + cta({title: 'Need a different kind of help?', copy: 'Find app answers, general contact options and the current privacy-policy status.', actions: link('Help & contact', '/help/#contact', 'button-white') + link('Privacy information', '/privacy/', 'button-outline')})
  };

  return [help, privacy, terms, dataRequests];
}
