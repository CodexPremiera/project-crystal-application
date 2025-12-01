# Desktop App Deployment Instructions

## Setup Complete ✅

The following components have been configured:

### 1. GitHub Actions Workflow ✅
- File: `.github/workflows/build-desktop.yml`
- Builds for: Windows, macOS, Linux
- Triggers: Manual dispatch or release tags (v*.*.*)
- Uploads: AWS S3 + GitHub Releases

### 2. Desktop App Production Environment ✅
- File: `crystal-desktop-app/.env.production`
- Configured URLs:
  - Clerk: Production publishable key
  - Express Server: Railway production URL
  - Web App: crystalapp.tech
  - Socket.IO: Railway WebSocket URL

### 3. Landing Page Download Section ✅
- File: `crystal-web-app/src/app/(website)/page.tsx`
- Features:
  - Platform detection (auto-highlights user's OS)
  - Download buttons for Windows, Mac, Linux
  - Links to S3 bucket releases
  - Installation instructions

---

## Required Manual Steps

### Step 1: Configure AWS S3 Bucket Policy

1. Go to AWS S3 Console: https://s3.console.aws.amazon.com/s3/buckets/crystalappbucket
2. Click on the **Permissions** tab
3. Scroll to **Bucket policy**
4. Click **Edit** and paste the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadDesktopAppReleases",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::crystalappbucket/desktop-app/releases/*"
    }
  ]
}
```

5. Click **Save changes**

This policy allows public read access ONLY to files in the `desktop-app/releases/` folder, keeping other files private.

---

### Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

| Secret Name | Value |
|------------|-------|
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Access Key |
| `AWS_REGION` | `ap-southeast-2` |
| `AWS_BUCKET` | `crystalappbucket` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Your production Clerk publishable key (`pk_live_...`) |

**Important:** Use your production Clerk key, not the development one.

---

### Step 3: Create First Release

After completing Steps 1-2, create your first release:

```bash
# Make sure all changes are committed
git add .
git commit -m "Setup desktop app deployment"

# Create and push release tag
git tag v0.0.1
git push origin v0.0.1
```

This will automatically trigger the GitHub Actions workflow to build executables for all platforms.

---

### Step 4: Deploy Web App Changes

Deploy the updated landing page to Vercel:

```bash
cd crystal-web-app
vercel --prod
```

Or push to your main branch if you have automatic deployments enabled.

---

## What Happens Next

1. **GitHub Actions** will start building the desktop app for all platforms
2. **Build artifacts** will be uploaded to:
   - S3: `s3://crystalappbucket/desktop-app/releases/v0.0.1/`
   - GitHub Releases: Attached to the v0.0.1 release
3. **Users can download** from your landing page at crystalapp.tech

---

## Monitoring the Build

1. Go to your GitHub repository
2. Click **Actions** tab
3. You'll see the "Build Desktop App" workflow running
4. It takes approximately 15-20 minutes to build all platforms

---

## Expected S3 Structure

After the workflow completes:

```
crystalappbucket/
└── desktop-app/
    └── releases/
        └── v0.0.1/
            ├── Crystal-Windows-0.0.1-Setup.exe
            ├── Crystal-Mac-0.0.1-Installer.dmg
            └── Crystal-Linux-0.0.1.AppImage
```

---

## Testing the Complete Flow

### Desktop App Testing:

1. **Download:** Visit crystalapp.tech and click your platform's download button
2. **Install:** Run the installer/executable
3. **Sign In:** Use your Clerk production credentials
4. **Record:** Test screen recording
5. **Upload:** Verify video uploads to Railway server
6. **View:** Check that video appears in web dashboard

### Integration Testing:

1. **Authentication:** Ensure Clerk sessions sync between desktop and web
2. **Video Upload:** Verify videos upload to Railway and appear in dashboard
3. **AI Features:** Test transcription for Pro users
4. **Playback:** Ensure videos play from CloudFront CDN

---

## Troubleshooting

### Build Fails

- Check GitHub Actions logs for errors
- Verify all secrets are correctly set
- Ensure AWS credentials have S3 write permissions

### Download Links Don't Work

- Verify S3 bucket policy is correctly set
- Check that files were uploaded to S3
- Ensure URLs in landing page match S3 file names

### Desktop App Can't Connect

- Verify Railway server is running
- Check desktop app `.env.production` has correct URLs
- Ensure Clerk production keys are set

---

## Future Releases

For subsequent releases:

```bash
# Update version in package.json
# Commit changes
git tag v0.0.2
git push origin v0.0.2
```

GitHub Actions will automatically build and upload the new version.

Update the version in `crystal-web-app/src/app/(website)/page.tsx` download links:

```typescript
const downloadLinks = {
  windows: 'https://crystalappbucket.s3.ap-southeast-2.amazonaws.com/desktop-app/releases/v0.0.2/Crystal-Windows-0.0.2-Setup.exe',
  // ... update other platforms
};
```

---

## Optional Enhancements

- **Auto-update:** Implement electron-updater for automatic updates
- **Analytics:** Track download counts
- **Version checker:** Show "New version available" in desktop app
- **Installation video:** Add demo video to landing page
- **System requirements:** Add detailed requirements section

