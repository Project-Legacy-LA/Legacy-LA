function buildAcceptInviteUrl(token) {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new Error('APP_BASE_URL must be an absolute URL (ex: https://app.example.com)');
  }
  const acceptUrl = new URL('/accept-invite', baseUrl);
  acceptUrl.searchParams.set('token', token);
  return acceptUrl;
}

function buildInviteEmail({ inviteType, inviterEmail, acceptUrl, context = {} }) {
  const safeInviter = inviterEmail || 'A Legacy LA team member';
  const urlText = acceptUrl.toString();

  switch (inviteType) {
    case 'attorney_owner': {
      const tenantName = context.tenantName || 'your firm';
      const subject = `You're invited to join ${tenantName} on Legacy LA`;
      const text = [
        `Hello,`,
        ``,
        `${safeInviter} invited you to join ${tenantName} on Legacy Louisiana.`,
        `Click the link below to accept the invite and set your password:`,
        urlText,
        ``,
        `If you were not expecting this invitation you can ignore this email.`,
      ].join('\n');

      const html = `
        <p>Hello,</p>
        <p>${safeInviter} invited you to join <strong>${tenantName}</strong> on Legacy Louisiana.</p>
        <p><a href="${urlText}">Accept your invitation</a> to set your password and activate your access.</p>
        <p>If you were not expecting this invitation you can ignore this email.</p>
      `;
      return { subject, text, html };
    }
    case 'client_owner': {
      const clientLabel = context.clientLabel || 'your estate workspace';
      const subject = `You're invited to access ${clientLabel} on Legacy LA`;
      const text = [
        `Hello,`,
        ``,
        `${safeInviter} invited you to access ${clientLabel} on Legacy Louisiana.`,
        `Click the link below to accept the invite and set your password:`,
        urlText,
        ``,
        `If you were not expecting this invitation you can ignore this email.`,
      ].join('\n');

      const html = `
        <p>Hello,</p>
        <p>${safeInviter} invited you to access <strong>${clientLabel}</strong> on Legacy Louisiana.</p>
        <p><a href="${urlText}">Accept your invitation</a> to set your password and activate your access.</p>
        <p>If you were not expecting this invitation you can ignore this email.</p>
      `;
      return { subject, text, html };
    }
    default: {
      const roleLabel = context.roleLabel || inviteType || 'Legacy Louisiana';
      const subject = `You're invited to Legacy Louisiana`;
      const text = [
        `Hello,`,
        ``,
        `${safeInviter} invited you to ${roleLabel} on Legacy Louisiana.`,
        `Click the link below to accept the invite and set your password:`,
        urlText,
        ``,
        `If you were not expecting this invitation you can ignore this email.`,
      ].join('\n');
      const html = `
        <p>Hello,</p>
        <p>${safeInviter} invited you to ${roleLabel} on Legacy Louisiana.</p>
        <p><a href="${urlText}">Accept your invitation</a> to set your password and activate your access.</p>
        <p>If you were not expecting this invitation you can ignore this email.</p>
      `;
      return { subject, text, html };
    }
  }
}

module.exports = {
  buildAcceptInviteUrl,
  buildInviteEmail,
};
