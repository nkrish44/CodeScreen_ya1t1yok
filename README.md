# Red Planet Staffing

Welcome to the red planet! At just over one million people as of the 2050 census, Martian settlements are flourishing. As the leading staffing marketplace on Mars, Red Planet connects workplaces with workers to fill shifts.

![Red Planet Staffing](./assets/red-planet.webp)

## Business context

Our primary customers are Martian workplaces. While they have full-time staff, they occasionally need short-term flexible staff to fill gaps in their operations (for example, when a worker is sick or on a vacation to the Moon).

When they need a worker, workplaces post a "shift" on our marketplace. These shifts are usually posted several weeks to a month in advance, but sometimes are posted last minute. Workers on our marketplace then claim these shifts and are assigned to them. Workers typically claim shifts 2-10 days in advance. Once assigned, workers perform the work at the shift's start time until its end time, and are paid based on the hours worked.

Workplaces value continuity of service: returning workers don't need to be re-oriented to the facility or introduced to the full-time staff, and they tend to perform better in environments they're familiar with. In practice, however, by the time a returning worker looks for their preferred workplace, the shifts they wanted are often already booked by someone else.

## Documentation

- [Server](./server/README.md)
- [Client](./client/README.md)

## Instructions
Our PM wants to incentivize workers to lock in their schedules early and provide continuity of service at the same workplaces. We are introducing a feature where booking shifts at a given workplace unlocks a pay bonus at the same workplace for the following week.

We want workers to be able to see which shifts carry a bonus so they can prioritize booking them. If a worker has booked >= 2 shifts at a specific workplace for the current week (Week N) they receive a 2% pay bonus on all shifts they view/book for the following week (Week N + 1). If they have booked >= 3 shifts this week, that bonus increases to 3%.

Your task is to implement the `GET /workers/:id/bonus-shifts` endpoint. A placeholder for this endpoint has already been stubbed out for you.

The endpoint should return a paginated list of shifts that have a streak bonus for the specified worker, using the PaginatedResponse type.

Example response:

```json
{
  "data": [
    {
      "id": 1,
      "startAt": "2026-01-30T09:00:00.000Z",
      "endAt": "2026-01-30T17:00:00.000Z",
      "jobType": "Life Support Technician",
      "workplaceId": 3,
      "workerId": null,
      "cancelledAt": null,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "streakBonusPercent": 0.02
    }
  ],
  "links": {
    "next": "..."
  }
}
```

### Exercise Notes
- Clipboard is an intense environment, you can read about our [company values](https://www.clipboardworks.com/resources/blog/clipboard-healths-company-values) (which we actually adhere to!) to get a feel for how we operate, but you should come to this assessment with the mindset that the level of work that you may have done in the past or typically think of as acceptable may not meet our bar here. We encourage you to put forth your best effort on this assignment, and push yourself further than you might ordinarily so that we're evaluating the best version of your work.
- Passing candidates will have a live-sync follow up so make sure to keep your repo and solution saved.
- We'll run an automated test suite against your solution, as a result:
  - GET /workers/:id/bonus-shifts must execute your implemented code
  - Your API response must adhere strictly to the format shown above.
- As much as possible, treat this assessment the way you would your first contribution at a new company. At Clipboard, we care about:
  - Completing the given task accurately
  - Committing high quality code that is easy to review, maintain, and extend
- Focus on making your solution functional rather than optimizing for performance
- We recognize that it's now commonplace to use AI copilots as a routine part of an engineer's job and expect you might leverage them while solving this problem, no problem! However, in the live interview you should expect that we will ***rigorously dig*** to understand and ***scrutinize*** how you got to your solution, will ***bias toward skepticism*** if you can't explain and iterate on your solution on your own, and ***will ultimately reject candidates*** who are over-dependent on AI.
## License

At CodeScreen, we strongly value the integrity and privacy of our assessments. As a result, this repository is under exclusive copyright, which means you **do not** have permission to share your solution to this test publicly (i.e., inside a public GitHub/GitLab repo, on Reddit, etc.). <br>

## Submitting your solution

Please follow the instructions in the `README` file for your assessment.<br>

Once you are finished with the task, please click the `Submit Solution` link on <a href="https://app.codescreen.com/candidate/79d526df-0357-4764-b257-70a4b0a11f07" target="_blank">this screen</a>.