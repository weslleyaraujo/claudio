import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { QueryKeys } from "../shared/QueryKeys";

const key = "@@has-seen-onboarding";

const get = async () => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? Boolean(value) : false;
  } catch (e) {
    throw new Error(e);
  }
};

const set = async () => {
  try {
    await AsyncStorage.setItem(key, "true");
  } catch (e) {
    throw new Error(e);
  }
};

const clear = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    throw new Error(e);
  }
};

function useHasSeenOnboarding() {
  return useQuery<boolean>(QueryKeys.HAS_SEEN_ONBOARDING, get);
}

function useCompleteOnboarding(options?: MutationOptions) {
  return useMutation(set, options);
}

function useFlushOnboarding(options?: MutationOptions) {
  const client = useQueryClient();
  return useMutation(clear, {
    ...options,
    onSuccess: (...args) => {
      client.refetchQueries([QueryKeys.HAS_SEEN_ONBOARDING]);
      options?.onSuccess?.call(null, ...args);
    },
  });
}

export { useHasSeenOnboarding, useCompleteOnboarding, useFlushOnboarding };
