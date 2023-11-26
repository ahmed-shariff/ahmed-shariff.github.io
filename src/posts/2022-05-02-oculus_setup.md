---
layout: post
comments: true
title: Setting up Oculus Quest 2 for development with Unity
tags: ["oculus", "vr", "guide"]
tagline: Step-by-step guide to setting up oculus for development with unity.
---
I am compiling the different steps (or the sources) you have follow to setup the device:

- Setup developer account (the dashboard has changed in the last months, so alot of the online tutorials may not look the same as the ones you'd encounter)
    - Go to [https://developer.oculus.com](https://developer.oculus.com/) and sign up and login
        - If you don't mind using your facebook account/creating a facebook account, you can use the facebook credentials to setup the account
        - If not when prompted create unmerged oculus developer account. Note that when not using a facebook account some functionalities in the quest would not be available, for example, you won't be able to use any other app than the ones you develop.
    - Go to [https://developer.oculus.com/manage/verify/](https://developer.oculus.com/manage/verify/) and add your contact number to verify your oculus developer account. See the [support page on Developer Verification](https://developer.oculus.com/faqs#faq_343265393702048) for more information.
    - Go to [https://developer.oculus.com/manage/organizations/](https://developer.oculus.com/manage/organizations/) and select/create an organization. When naming a new organization it can be anything, even a random string.
- [Setup you device](https://www.youtube.com/watch?v=ZBSiZ5Pcjjg)
Download and install the [oculus quest mobile app](https://support.oculus.com/1178714089211378) on you personal smartphone (you can also use the android tablet you are provided with)
    - The app would require you to login with a facebook account. 
        - If you used a facebook account to create the developer account, use the same facebook credentials to login.
        - Alternatively, you can use a test account (for more information see [https://developer.oculus.com/resources/test-users/](https://developer.oculus.com/resources/test-users/)). Note that this will not allow you to use apps other than the ones you develop.
            - Go to [https://developer.oculus.com/manage/organizations/](https://developer.oculus.com/manage/organizations/) and select the organization you created. 
            - Select Test Users
            - Select Add Test User
            - Provide dummy details
            - Create test account
            - Use the email shown and password used to login to the oculus app on the mobile phone
        - Skip the payment detail section
        - Note that to switch account after you pair a device, you'll have to [do a factory reset](https://support.oculus.com/articles/fix-a-problem/troubleshoot-headsets-and-accessories/troubleshooting-factory-reset-quest-2/).
    - Make sure the headset is [charged, turned on and properly adjusted to fit you](https://support.oculus.com/526118881723537). 
    - You'd need to enable bluetooth on your mobile device and have the headset nearby
    - After going through the steps of setting up the mobile app, you'd be prompted to select a headset, pick the Oculus Quest 2 to pair devices. This should start the pairing process
    - If you don't get an automatic prompt, look in the headset for the 5 digit code. In the mobile app, under devices select pair new headset and enter the code.
    - Wear the headset and follow the instructions to complete the setup
    - Have some fun in VR, try some of the tutorials and free apps in the app store (if it is allowed based on the account you used, I know, facebook sucks).
- Follow instructions on the oculus documentation to setup the device for development ([link](https://developer.oculus.com/documentation/unity/unity-enable-device/))
    - If you are on windows you'd have to [install drivers](https://developer.oculus.com/documentation/unity/unity-enable-device/#enable-adb).
    - Connect the device to your pc and make sure you it shows up as a device (may have to accept the permission request in the headset)
- [Import oculus integration in unity project](https://developer.oculus.com/documentation/unity/unity-import/).
- [Configure the unity application for oculus development](https://developer.oculus.com/documentation/unity/unity-conf-settings/).
