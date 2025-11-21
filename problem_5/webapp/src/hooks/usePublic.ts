export default function usePublic() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://problem5-latest.onrender.com';
  return apiUrl;
}
