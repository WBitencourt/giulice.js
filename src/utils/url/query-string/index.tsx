import { ReadonlyURLSearchParams } from "next/navigation";

interface UpdateQueryStringProps {
  values: {
    [key: string]: string | undefined;
  },
  searchParams: ReadonlyURLSearchParams;
}

export const updateQueryString = ({ values, searchParams }: UpdateQueryStringProps) => {
  if(Object.keys(values).length === 0) {
    return ''
  }

  const newQuery = new URLSearchParams(searchParams.toString())

  Object.keys(values).map((key) => {
    if(values[key]?.length === 0) {
      return;
    }
    
    newQuery.set(key, values[key] ?? '');
  })

  return `?${newQuery.toString()}`
}