import { debounceTime, OperatorFunction, SchedulerLike, concat } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { publish, take } from 'rxjs/operators';

export function debounceTimeAfter(
  amount: number,
  dueTime: number,
  scheduler: SchedulerLike = async
): OperatorFunction<number, any> {
  return publish((value) =>
    concat(
      value.pipe(take(amount)),
      value.pipe(debounceTime(dueTime, scheduler))
    )
  );
}

export function debounceTimeAfterFirst(
  dueTime: number,
  scheduler: SchedulerLike = async
): OperatorFunction<number, any> {
  return debounceTimeAfter(1, dueTime, scheduler);
}
