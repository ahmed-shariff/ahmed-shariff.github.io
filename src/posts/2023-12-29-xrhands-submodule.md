---
layout: post
comments: true
title: "Writing a simple XR Hands subsystem"
tags: ["programming", "hci", "machine learning", "HPUI", "Vicon", "guide", "Unity", "software design"]
tagline: "A quick summary of how to write and use a custom XR Hand provider for Unity"
published: false
---

I was trying to provide the data from a custom motion capture pipeline through the Unity XR Hands Subsystem API. Naturally, the documentation on this is not the best.

## Context

I had finally gotten around to rewriting the [HPUI package](https://github.com/ovi-lab/HPUI-Core) to use the [XR Hands package](https://docs.unity3d.com/Packages/com.unity.xr.hands@1.4/manual/index.html).
Since most vision-based hand tracking is still somewhat lacking in terms of the fidelity required for studying HPUI, we use the Vicon motion capture system to do the hand tracking. 
The motion capture system itself is not very good when trying to solve the skeleton of the hands (or I haven't figured out how to do it properly). 
But, it is very good at tracking the location of markers. 
So I wrote a separate pipeline to get the marker data and solve the skeleton in Unity.
In the old implementation of HPUI, I had a very crude system that does what the Unity XR Hands package does.
i.e., it allowed me to use it with any package that would be driving a hand model in Unity.
This part was built around using the data from the vicon. 
Hence setting up HPUI for a new hand-tracking solution was - not fun.
Plus, the Vicon data pipeline and the HPUI package were how I learned to do programming for Unity.
So it goes without saying - it's all one big hot mess.
Which is what prompted the HPUI rewrite.
But that also means making the [Vicon pipeline](https://github.com/ovi-lab/vicon-nexus-unity-stream) work with Unity XR Hands.
I need to de-spaghettify the Vicon pipeline at some point. 
But I expect the XR Hands Subsystem as I am describing here to remain mostly the same.

## The subsystem implementation

Following the [documentation of how to write a provider](https://docs.unity3d.com/Packages/com.unity.xr.hands@1.4/manual/implement-a-provider.html) is not too hard.
Implement `XRHandSubsystemProvider`, extend `XRHandSubsystem` (which can be an empty) and a static method that would register the subsystem (see a full minimal example at the end).
One thing to keep in mind here is that the poses are expected to be relative to the XROrigin.
That part I didn't fully understand and isn't documented properly is how to have the subsystem I register start and do its thing.
Turns out there is a Utility class that can be used to start and stop the custom subsystem - [`XRHandProviderUtility.SubsystemUpdater`](https://docs.unity3d.com/Packages/com.unity.xr.hands@1.4/api/UnityEngine.XR.Hands.ProviderImplementation.XRHandProviderUtility.SubsystemUpdater.html).
As far as I have understood, there are two ways of going about this.
One is to have it start and stop from within a [Unity XR Loader](https://docs.unity3d.com/Packages/com.unity.xr.hands@1.4/manual/implement-a-provider.html#implement-an-xr-loader) or have it manually trigger somewhere within the scene.
While it's tempting to learn how to implement an XR Loader, in the interest of not adding on more tangents, I opted for the latter option.

`XRHandsSubsystem` extends `SubsystemWithProvider`, which has `OnStart`, `OnStop` and `OnDestroy` which can be extended.
These methods also call the providers `Start`, `Stop` and `Destroy` methods.
The `SubsystemUpdater` also has a `Start`, `Stop` and `Destroy` method.
So what I ended up doing is having the `SubsystemUpdated`s methods called in the respective methods in the `XRHandsSubsystem`.

Following is a very simple implementation of the subsystem and provider.
The Vicon data pipeline uses the `MyHandSubsystem.SetHandPoses` to feed the data to the subsystem.

### The provider
```csharp
using System.Collections.Generic;
using Unity.Collections;
using UnityEngine;
using UnityEngine.XR.Hands;
using UnityEngine.XR.Hands.ProviderImplementation;

namespace MyCustomXRHandsProvider
{
    public class MyHandProvider : XRHandSubsystemProvider
    {
        private Dictionary<Handedness, Dictionary<XRHandJointID, Pose>> handsPoses = new Dictionary<Handedness, Dictionary<XRHandJointID, Pose>>();

        /// <inheritdoc />
        public override void Destroy()
        {}

        /// <inheritdoc />
        public override void GetHandLayout(NativeArray<bool> handJointsInLayout)
        {
            handJointsInLayout[XRHandJointID.Palm.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.Wrist.ToIndex()] = true;

            handJointsInLayout[XRHandJointID.ThumbMetacarpal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.ThumbProximal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.ThumbDistal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.ThumbTip.ToIndex()] = true;

            handJointsInLayout[XRHandJointID.IndexMetacarpal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.IndexProximal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.IndexIntermediate.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.IndexDistal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.IndexTip.ToIndex()] = true;

            handJointsInLayout[XRHandJointID.MiddleMetacarpal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.MiddleProximal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.MiddleIntermediate.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.MiddleDistal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.MiddleTip.ToIndex()] = true;

            handJointsInLayout[XRHandJointID.RingMetacarpal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.RingProximal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.RingIntermediate.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.RingDistal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.RingTip.ToIndex()] = true;

            handJointsInLayout[XRHandJointID.LittleMetacarpal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.LittleProximal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.LittleIntermediate.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.LittleDistal.ToIndex()] = true;
            handJointsInLayout[XRHandJointID.LittleTip.ToIndex()] = true;
        }

        /// <inheritdoc />
        public override void Start()
        {
            handsPoses.Clear();
        }

        /// <inheritdoc />
        public override void Stop()
        {
            handsPoses.Clear();
        }

        /// <inheritdoc />
        public override XRHandSubsystem.UpdateSuccessFlags TryUpdateHands(XRHandSubsystem.UpdateType updateType,
                                                                          ref Pose leftHandRootPose,
                                                                          NativeArray<XRHandJoint> leftHandJoints,
                                                                          ref Pose rightHandRootPose,
                                                                          NativeArray<XRHandJoint> rightHandJoints)
        {
            if (handsPoses.Count == 0)
            {
                return XRHandSubsystem.UpdateSuccessFlags.None;
            }

            XRHandSubsystem.UpdateSuccessFlags successFlags = XRHandSubsystem.UpdateSuccessFlags.None;
            if (handsPoses.ContainsKey(Handedness.Left) && UpdateJointData(Handedness.Left, leftHandJoints, ref leftHandRootPose))
            {
                successFlags |= XRHandSubsystem.UpdateSuccessFlags.LeftHandRootPose | XRHandSubsystem.UpdateSuccessFlags.LeftHandJoints;
            }

            if (handsPoses.ContainsKey(Handedness.Right) && UpdateJointData(Handedness.Right, rightHandJoints, ref rightHandRootPose))
            {
                successFlags |= XRHandSubsystem.UpdateSuccessFlags.RightHandRootPose | XRHandSubsystem.UpdateSuccessFlags.RightHandJoints;
            }

            return successFlags;
        }

        /// <summary>
        /// Update the poses of the joints.
        /// </summary>
        internal void SetHandPoses(Handedness handedness, Dictionary<XRHandJointID, Pose> poses)
        {
            this.handsPoses[handedness] = poses;
        }

        /// <summary>
        /// Populate the handJoints array.
        /// </summary>
        protected bool UpdateJointData(Handedness handedness, NativeArray<XRHandJoint> handJoints, ref Pose handRootPose)
        {
            if (!handsPoses.ContainsKey(handedness))
            {
                return false;
            }

            var handPoseCache = handsPoses[handedness];

            for (int jointIndex = XRHandJointID.BeginMarker.ToIndex(); jointIndex < XRHandJointID.EndMarker.ToIndex(); ++jointIndex)
            {
                XRHandJointID jointID = XRHandJointIDUtility.FromIndex(jointIndex);

                Pose pose = handPoseCache[jointID];

                handJoints[jointIndex] = XRHandProviderUtility.CreateJoint(handedness, XRHandJointTrackingState.Pose, jointID, pose);
            }

            handRootPose = handPoseCache[XRHandJointID.Wrist];
            return true;
        }
    }
}
```


### The subsystem

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.Hands;
using UnityEngine.XR.Hands.ProviderImplementation;

namespace MyCustomXRHandsProvider
{
    public class MyHandSubsystem: XRHandSubsystem
    {
        internal static string id = "my-hands-subsystem";

        public static ViconHandSubsystem subsystem;

        private ViconHandProvider handsProvider => provider as ViconHandProvider;
        private XRHandProviderUtility.SubsystemUpdater subsystemUpdater;

        // This method registers the subsystem descriptor with the SubsystemManager
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        static void RegisterDescriptor()
        {
            var handsSubsystemCinfo = new XRHandSubsystemDescriptor.Cinfo
            {
                id = id,
                providerType = typeof(ViconHandProvider),
                subsystemTypeOverride = typeof(ViconHandSubsystem)
            };
            XRHandSubsystemDescriptor.Register(handsSubsystemCinfo);
        }

        /// <summary>
        /// Initilize the hand subsystem
        /// </summary>
        public static void MaybeInitializeHandSubsystem()
        {
            if (subsystem == null && true) // TODO: Get from scriptable object if we want hand subsystem
            {
                // I want to disbale other XR Hand Subsystems
                {
                    List<XRHandSubsystem> currentHandSubsystems = new List<XRHandSubsystem>();
                    SubsystemManager.GetSubsystems(currentHandSubsystems);
                    foreach (XRHandSubsystem handSubsystem in currentHandSubsystems)
                    {
                        if (handSubsystem.running)
                            handSubsystem.Stop();
                    }
                }

                List<XRHandSubsystemDescriptor> descriptors = new List<XRHandSubsystemDescriptor>();
                SubsystemManager.GetSubsystemDescriptors(descriptors);
                for (var i = 0; i < descriptors.Count; ++i)
                {
                    var descriptor = descriptors[i];
                    if (descriptor.id == id)
                    {
                        subsystem = descriptor.Create() as ViconHandSubsystem;
                        break;
                    }
                }
            }
        }

        /// <summary>
        /// Set the hand poses to provide through the subsystem.
        /// </summary>
        public void SetHandPoses(Handedness handedness, Dictionary<XRHandJointID, Pose> poses)
        {
            handsProvider.SetHandPoses(handedness, poses);
        }

        /// <inheritdoc />
        protected override void OnStart()
        {
            base.OnStart();
            if (subsystemUpdater == null)
            {
                subsystemUpdater = new XRHandProviderUtility.SubsystemUpdater(ViconHandSubsystem.subsystem);
            }
            subsystemUpdater.Start();

        }

        /// <inheritdoc />
        protected override void OnStop()
        {
            base.OnStop();
            subsystemUpdater.Stop();
        }

        /// <inheritdoc />
        protected override void OnDestroy()
        {
            base.OnDestroy();
            subsystemUpdater.Destroy();
            subsystemUpdater = null;
        }
    }
}
```
