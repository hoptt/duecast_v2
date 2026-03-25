"use client";

import { useState, useEffect } from "react";

interface CurrentTime {
  hour: number;
  minute: number;
  timeString: string;
}

function getTime(): CurrentTime {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return { hour, minute, timeString };
}

export function useCurrentTime(): CurrentTime {
  // 초기값: SSR에서는 서버 시각이 들어오므로, useEffect에서 클라이언트 기준으로 동기화
  const [time, setTime] = useState<CurrentTime>({ hour: 0, minute: 0, timeString: "00:00" });

  useEffect(() => {
    // 마운트 즉시 클라이언트 시각으로 갱신
    setTime(getTime());

    // 매 분마다 갱신
    const id = setInterval(() => setTime(getTime()), 60_000);
    return () => clearInterval(id);
  }, []);

  return time;
}
