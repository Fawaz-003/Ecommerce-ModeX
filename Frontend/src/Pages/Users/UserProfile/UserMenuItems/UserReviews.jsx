import { useEffect, useState } from "react";
import { useAppContext } from "../../../../Context/AppContext";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const UserReviews = () => {
  const { axios, user } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ensureProfileAndFetchReviews = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        // Ensure profile exists before fetching, creating it if necessary.
        await axios.post(`/api/profile/create/${user._id}`);

        // Now fetch the profile with reviews
        const res = await axios.get(`/api/profile/${user._id}`);

        if (res.data.success) {
          // Sort reviews by most recent
          const sortedReviews = res.data.profile.reviews.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setReviews(sortedReviews);
        }
      } catch (err) {
        // If profile creation fails or fetching still fails, show an error.
        // The create profile endpoint returns 200 if profile exists, so we shouldn't get a 404 here anymore
        // unless there's another issue.
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    ensureProfileAndFetchReviews();
  }, [user, axios]);

  if (loading) {
    return <div className="text-center p-4">Loading your reviews...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center p-4">You haven't written any reviews yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
      {reviews.map((review) => (
        <Link to={`/products/${review.product}`} key={review._id} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4">
            <img
              src={review.productImage || "/placeholder.png"}
              alt={review.productName}
              className="w-full sm:w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{review.productName}</h3>
              <div className="flex items-center my-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserReviews;