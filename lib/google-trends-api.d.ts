declare module 'google-trends-api' {
  interface InterestOverTimeOptions {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
  }
  const googleTrends: {
    interestOverTime(options: InterestOverTimeOptions): Promise<string>;
  };
  export default googleTrends;
}
