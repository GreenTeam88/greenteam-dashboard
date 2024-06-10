export async function loginAction(data) {
  await new Promise(() => setTimeout(() => console.log(data), 3000));
}
