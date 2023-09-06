import { orderContant } from "./contant";

export const isJsonString = (data) => {
    try{
        JSON.parse(data)
    } catch(error){
         return false
    }
    return true
}
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
export const renderOptions = (arr) => {
  let results = []
  if(arr) {
      results = arr?.map((opt) => {
          return {
              value: opt,
              label: opt
          }
      })
  }
  results.push({
      label: 'New type...',
      value: 'add_type'
  })
  return results
}
export const convertPrice = (price) => {
  try{
    const res = price?.toLocaleString().replaceAll(',','.')
    return `${res} VND`
  }catch(e) {
    return null
  }
}
export const convertDataChart = (data, type) => {
  try {
      const object = {}
      data?.forEach((opt) => {
          if(!object[opt[type]]) {
              object[opt[type]] = 1
          } else {
              object[opt[type]]+=1
          }
      })
      const results = Object.keys(object)?.map((item) => {
          return {
              name: orderContant.payment[item],
              value: object[item]
          }
      })
      return results
  }catch(e) {
      return []
  }
}