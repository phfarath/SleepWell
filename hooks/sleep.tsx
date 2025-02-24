import { supabase } from "@/lib/supabase";

export async function getSleepLogs(userId: string) {
  const { data, error } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addSleepLog(userId: string, bedtime: string, wakeTime: string, quality: number, mood: string, notes?: string) {
  const { data, error } = await supabase
    .from("sleep_logs")
    .insert([{ user_id: userId, bedtime, wake_time: wakeTime, quality, mood, notes }]);

  if (error) throw error;
  return data;
}
