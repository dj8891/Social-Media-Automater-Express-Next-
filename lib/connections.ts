import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const checkInstagramConnection = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const isConnected = false;

  //   const userSubscription = await prismadb.userSubscription.findUnique({
  //     where: {
  //       userId: userId,
  //     },
  //     select: {
  //       stripeSubscriptionId: true,
  //       stripeCurrentPeriodEnd: true,
  //       stripeCustomerId: true,
  //       stripePriceId: true,
  //     },
  //   });

  //   if (!userSubscription) {
  //     return false;
  //   }

  //   const isValid =
  //     userSubscription.stripePriceId &&
  //     userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
  //       Date.now();

  return !!isConnected;
};

export const checkFacebookConnection = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const isConnected = false;

  //   const userSubscription = await prismadb.userSubscription.findUnique({
  //     where: {
  //       userId: userId,
  //     },
  //     select: {
  //       stripeSubscriptionId: true,
  //       stripeCurrentPeriodEnd: true,
  //       stripeCustomerId: true,
  //       stripePriceId: true,
  //     },
  //   });

  //   if (!userSubscription) {
  //     return false;
  //   }

  //   const isValid =
  //     userSubscription.stripePriceId &&
  //     userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
  //       Date.now();

  return !!isConnected;
};

export const checkTwitterConnection = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const isValid = false;

  //   const userSubscription = await prismadb.userSubscription.findUnique({
  //     where: {
  //       userId: userId,
  //     },
  //     select: {
  //       stripeSubscriptionId: true,
  //       stripeCurrentPeriodEnd: true,
  //       stripeCustomerId: true,
  //       stripePriceId: true,
  //     },
  //   });

  //   if (!userSubscription) {
  //     return false;
  //   }

  //   const isValid =
  //     userSubscription.stripePriceId &&
  //     userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
  //       Date.now();

  return !!isValid;
};

export const checkWooCommerceConnection = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  let isValid = false;

  const isConnected = await prismadb.wooCommerceConnections.findUnique({
    where: {
      userId: userId,
      consumerKey: { not: null },
      consumerSecret: { not: null },
    },
  });

  if (!isConnected) {
    return false;
  } else {
    isValid = true;
  }

  console.log(!!isValid);

  return !!isValid;
};
