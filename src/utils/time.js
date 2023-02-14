/**
 * @param  date Date 객체
 * @return [yyyy, mm, dd]
 */
export const getYearMonthDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  return [year, month, date];
};
