/* Public service explanations. Booking and account destinations stay in site-content.json. */
export function createServicePages(ctx) {
  const {config, escape: e, hero, section, cards, faq, button, link, notice, cta} = ctx;
  const careBooking = button('Check care availability', 'care');
  const blueprintBooking = button('Check assessment availability', 'blueprint');
  const hubEnquiry = button('Check visit availability', 'hubs');
  const approvedProfiles = Object.entries(config.profiles).map(([id, profile]) => `
    <article class="core-profile">
      <img src="${e(profile.image)}" width="750" height="1000" alt="${e(profile.name)}" loading="lazy">
      <div><h3>${e(profile.name)}</h3><p>${e(profile.role)}</p>${button('View profile', `doctor-${id}`)}</div>
    </article>`).join('');

  const care = {
    slug: 'care',
    title: 'Professional care',
    description: 'Explore how optional professional care connects with Orb, from online consultations to in-person support.',
    body: hero({
      eyebrow: 'Professional care',
      title: 'The right expertise.<br>For your next step.',
      copy: 'Your appointment is one moment. Your meals, movement and questions fill the days between. Explore how optional care can bring that everyday context into the conversation.',
      actions: link('Find your kind of support', '#care-paths', 'button-white') + link('Explore Blueprint', '/blueprint/', 'core-button-outline'),
      image: 'assets/optimized/Frame%202147228992.webp',
      alt: 'Illustrative professional care concept from the Orb homepage',
      note: 'Illustrative care concept. Professional care is optional and purchased separately.'
    }) + section({
      id: 'care-paths', title: 'Choose how you want support.',
      copy: 'Orb, online professional care and a hub visit are different experiences. Choose the next step that fits what you need.',
      body: cards([
        {title: 'Orb app', copy: 'Bring your everyday information into the planning and tracking tools available in your app plan.', action: link('Compare app plans', '/plans/')},
        {title: 'Online professional care', copy: 'Explore consultations and follow-up through a separate professional service. The professional and inclusions depend on the service you choose.', action: careBooking},
        {title: 'In-person care and Orb', copy: 'Explore assessment and training at a Cureocity hub, connected with the progress you follow in Orb.', action: link('Explore our hubs', '/hubs/')}
      ], 3) + notice('Availability is being confirmed', 'Verified services, locations, package inclusions and booking links are not connected to this preview. Checking availability here does not book an appointment.')
    }) + section({
      id: 'expertise', title: 'Different expertise. One clearer conversation.',
      copy: 'These roles explain the kinds of support involved in professional care. The available professionals depend on the service purchased.', tone: 'soft',
      body: `<dl class="core-role-list">
        <div><dt>Doctors</dt><dd>Clinical concerns and treatment decisions.</dd></div>
        <div><dt>Dietitians</dt><dd>Nutrition needs translated into workable food plans.</dd></div>
        <div><dt>Fitness trainers</dt><dd>Movement, technique and progression.</dd></div>
        <div><dt>Psychologists</dt><dd>Support for psychological needs and emotional wellbeing.</dd></div>
      </dl><div class="core-subheading"><h3>Meet the medical directors</h3><p>The two professionals featured on the Orb homepage. Their profiles do not establish appointment availability.</p></div><div class="core-profile-grid">${approvedProfiles}</div>`
    }) + section({
      id: 'prepare-for-care', title: 'Bring the context that matters.',
      copy: 'A little preparation can make your next conversation more focused. Keep the originals and decide what you want to discuss.',
      body: `<ul class="core-checklist"><li>Your main questions and what you would like help with.</li><li>Relevant reports, prescriptions and their dates.</li><li>Notes about meals, movement, symptoms and your everyday routine.</li><li>Any preferences or practical constraints you want your professional to understand.</li></ul>` + notice('Before sharing information', 'Confirm which information the service needs and which sharing controls are available in the released app. No health information is uploaded or shared from this page.')
    }) + section({
      id: 'care-questions', title: 'Questions before you choose.',
      body: faq([
        {q: 'Are consultations included in Orb Pro?', a: 'Professional care is optional and purchased separately. The final app-plan inclusions and each care package must be confirmed before purchase. You can compare the current app-plan preview on the Plans page.'},
        {q: 'Which professional will I speak to?', a: 'That depends on the service you select and the professionals available for it. A verified roster, consultation types and booking destination are still awaiting confirmation.'},
        {q: 'Does Orb replace a doctor?', a: 'Orb supports everyday understanding and planning. Diagnosis, clinical assessment and treatment decisions belong with appropriately qualified professionals.'},
        {q: 'How is Blueprint different from ongoing care?', a: 'Blueprint is an assessment experience that brings information into findings, priorities and next steps. Ongoing consultations or follow-up depend on the separate service purchased. Package inclusions are awaiting confirmation.'}
      ])
    }) + cta({title: 'Find the support for your next step.', copy: 'Explore a professional service, or begin by understanding your starting point with Blueprint.', actions: button('Check care availability', 'care', 'button-white') + link('Explore Blueprint', '/blueprint/', 'core-button-outline')})
  };

  const blueprint = {
    slug: 'blueprint',
    title: 'Cureocity Blueprint',
    description: 'Understand Blueprint assessment inputs, professional consultations, findings, agreed priorities and next steps.',
    body: hero({
      eyebrow: 'Cureocity Blueprint',
      title: 'Understand your starting point.<br>Build from there.',
      copy: 'Bring your history, nutrition and movement into the professional consultations included in your assessment. Leave with findings and next steps you can return to.',
      actions: link('See how it comes together', '#blueprint-inputs', 'button-white') + button('Check assessment availability', 'blueprint', 'core-button-outline'),
      image: 'assets/optimized/sdsdsdsds.webp',
      alt: 'Illustrative assessment report and consultation documents from the Orb homepage',
      note: 'Illustrative assessment documents. Package contents and availability are awaiting confirmation.'
    }) + section({
      id: 'blueprint-inputs', title: 'Your starting point comes from context.',
      copy: 'Blueprint brings different sources into a professional assessment. Your history, records, movement and consultations each contribute useful context.',
      body: `<div class="core-flow"><div class="core-flow-inputs">
        <article><span class="tag">Your context</span><h3>Health history</h3><p>Your concerns, goals and relevant history.</p></article>
        <article><span class="tag">Your records</span><h3>Relevant reports</h3><p>Existing results and their dates and sources.</p></article>
        <article><span class="tag">Your movement</span><h3>Movement assessment</h3><p>Findings from the assessment included in your package.</p></article>
        <article><span class="tag">Professional input</span><h3>Consultations</h3><p>The expertise and discussions included in your assessment.</p></article>
      </div><div class="core-flow-output"><span class="tag">Your Blueprint</span><h3>Findings you can build from.</h3><p>The information is considered together, then translated into agreed priorities and next steps.</p><span class="core-caption">Illustrative process. Confirmed package inclusions may vary.</span></div></div>`
    }) + section({
      id: 'blueprint-findings', title: 'Leave with something to return to.', tone: 'soft',
      body: cards([
        {title: 'Your assessment findings', copy: 'Understand the observations from the information and assessments included in your package.'},
        {title: 'Agreed priorities', copy: 'Discuss what deserves attention first and what fits your current circumstances.'},
        {title: 'Your next steps', copy: 'Return to the actions and follow-up discussed with your professionals.'}
      ], 3)
    }) + section({
      id: 'blueprint-options', title: 'Explore the assessment experience.',
      copy: 'The homepage introduces online and centre-based experiences. Confirm the delivery mode, location and included services before booking.',
      body: cards([
        {title: 'Complete online', copy: 'Explore the guided assessments and professional consultations included in an online package. Requirements and availability are being confirmed.', action: blueprintBooking},
        {title: 'Take at a centre', copy: 'Explore the assessments available through your local hub. An assessment package and a training membership are separate choices.', action: link('Explore our hubs', '/hubs/')}
      ], 2) + notice('Before you book', 'Check the included assessments, consultations, preparation requirements, price and follow-up. No assessment booking or payment starts on this preview page.')
    }) + section({
      id: 'blueprint-questions', title: 'A few useful answers.',
      body: faq([
        {q: 'Can I bring reports I already have?', a: 'Relevant reports can contribute to the assessment discussion. Confirm which reports, formats and dates the selected package accepts before sharing them. This website does not upload or review your reports.'},
        {q: 'Does Blueprint include a hub membership?', a: 'An assessment package is separate from a hub membership. Review the actual package and any ongoing training or follow-up service before purchase.'},
        {q: 'Is Blueprint included in the Orb app price?', a: 'The app plan and professional assessment are separate service choices. Final assessment prices and package inclusions are not confirmed in this preview.'},
        {q: 'Where can I take an assessment?', a: 'Online availability, participating locations and booking destinations are still awaiting confirmation. The preview does not establish availability in a particular city or country.'}
      ])
    }) + cta({title: 'Make your starting point clearer.', copy: 'Review the assessment options and the professional support around them.', actions: button('Check assessment availability', 'blueprint', 'button-white') + link('Explore professional care', '/care/', 'core-button-outline')})
  };

  const hubs = {
    slug: 'hubs',
    title: 'Cureocity Health and Fitness Hubs',
    description: 'Explore how in-person assessment and training at Cureocity hubs can connect with the progress you follow in Orb.',
    body: hero({
      eyebrow: 'Health & Fitness Hubs',
      title: 'Bring your plan<br>into your training.',
      copy: 'Explore in-person assessment and training services that connect with the progress you follow in Orb. Find out what is included before choosing your next step.',
      actions: link('Plan your visit', '#hub-locations', 'button-white') + link('Explore Blueprint', '/blueprint/', 'core-button-outline'),
      image: 'assets/optimized/Frame%202147228935.webp',
      alt: 'Illustrative Cureocity hub setting from the homepage, not a verified location listing',
      note: 'Illustrative hub setting. Verified locations and local service availability are awaiting confirmation.'
    }) + section({
      id: 'hub-services', title: 'Make room for in-person support.',
      copy: 'Explore the services included at your local hub. These are service categories to discuss, not a confirmed list of inclusions at every location.',
      body: cards([
        {title: 'Understand your starting point', copy: 'Explore the movement assessments and professional services available at the centre.', action: link('Understand Blueprint', '/blueprint/')},
        {title: 'Build your training routine', copy: 'Discuss training, technique and progression around your goals, experience and available time.', action: hubEnquiry},
        {title: 'Follow your progress in Orb', copy: 'Ask how the service connects with the planning and progress information available in your Orb plan.', action: link('Compare app plans', '/plans/')}
      ], 3)
    }) + section({
      id: 'hub-locations', title: 'Find the right place to begin.', tone: 'soft',
      copy: 'A useful visit starts with accurate local information.',
      body: `<div class="core-location-empty"><svg class="icon" aria-hidden="true"><use href="#i-shield"></use></svg><div><h3>Location details are being confirmed.</h3><p>Verified hub addresses, opening information, local services and enquiry links are not connected to this preview yet. The imagery above is illustrative.</p><p>Once confirmed, this page will help you compare locations and reach the right local team.</p>${button('Check visit availability', 'hubs')}</div></div>`
    }) + section({
      id: 'hub-visit', title: 'Know what to ask before you visit.',
      body: `<ul class="core-checklist"><li>Which assessment and training services are available at this location?</li><li>What is included in the service, and what is purchased separately?</li><li>What are the confirmed prices, schedules and booking requirements?</li><li>What should you bring, and is there any preparation for the assessment?</li><li>How does this service connect with your Orb plan and progress?</li></ul>` + notice('Assessment and membership are different', 'A Blueprint assessment helps establish findings and next steps. Hub training or membership is a separate service choice. The inclusions and availability of each must be confirmed locally.')
    }) + section({
      id: 'hub-questions', title: 'Before your next visit.',
      body: faq([
        {q: 'Which cities have Cureocity hubs?', a: 'The verified location list is not yet connected to this preview. We have not published addresses or maps without confirmed location information.'},
        {q: 'Does Orb Pro include in-person training?', a: 'Professional care and in-person services are optional and purchased separately. Confirm the local service and app-plan inclusions before purchasing.'},
        {q: 'Can I take Blueprint at a hub?', a: 'Centre-based assessment is one of the experiences introduced on this website. Participating locations, package contents and booking availability still need confirmation.'},
        {q: 'Can I book a visit here?', a: 'The verified booking or enquiry destination is not connected yet. The preview provides information but does not reserve a visit, take payment or submit an enquiry.'}
      ])
    }) + cta({title: 'Take your next step with context.', copy: 'Explore an assessment, understand your service options and check what is available locally.', actions: button('Check visit availability', 'hubs', 'button-white') + link('Explore Blueprint', '/blueprint/', 'core-button-outline')})
  };

  return [care, blueprint, hubs];
}
