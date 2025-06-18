"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { user } = useAuth();
  const authUser = user?.user;

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error(err.message);
      return null;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const reviewRes = await fetch(`${API_BASE}/products/${id}/reviews`);
        const reviewData = await reviewRes.json();
        setReviews(
          Array.isArray(reviewData) ? reviewData : reviewData.reviews || []
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product or reviews.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!authUser?.id) {
      toast.warning("Please log in to submit a review.");
      return;
    }

    if (!reviewText.trim()) {
      toast.warning("Review text cannot be empty.");
      return;
    }

    try {
      let imageUrl = null;

      if (selectedImage) {
        toast.loading("Uploading image...");
        imageUrl = await uploadToCloudinary(selectedImage);
        toast.dismiss();

        if (!imageUrl) {
          toast.error("Image upload failed. Try again.");
          return;
        }
      }

      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: authUser.id,
          product_id: id,
          rating: parseInt(rating),
          review: reviewText,
          image: imageUrl,
        }),
      });

      const newReview = await res.json();

      if (res.ok) {
        setReviews((prev) => [newReview, ...prev]);
        setReviewText("");
        setRating(5);
        setSelectedImage(null);
        setPreviewImage(null);
        toast.success("Review submitted successfully!");
      } else {
        toast.error(newReview.message || "Failed to post review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong while submitting the review.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!product) return <div className="p-6 text-center">Product Not Found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          {product.images?.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={300}
              className="rounded-lg object-cover w-full"
            />
          ) : (
            <p>No Image Available</p>
          )}
        </div>
        <div className="md:w-1/2">
          <p className="mb-2">{product.description}</p>
          <p className="text-lg font-semibold mb-2">Price: ₹{product.price}</p>
          <p className="text-green-600">Discount: {product.discount}%</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
        <form onSubmit={handleReviewSubmit} className="mb-4">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            disabled={!authUser?.id}
            className="w-full border rounded-md p-2 mb-2 disabled:opacity-50"
            placeholder="Write your review here..."
            rows={4}
          />
          <div className="flex justify-between">
            {/* Image Upload with Preview */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload an image (optional):
              </label>

              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-700 transition">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={!authUser?.id}
                    className="hidden"
                  />
                </label>

                {selectedImage && (
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {selectedImage.name}
                  </span>
                )}
              </div>

              {previewImage && (
                <div className="mt-4">
                  <Image
                    src={previewImage}
                    alt="Selected Preview"
                    width={250}
                    height={180}
                    className="rounded-lg border-2 border-gray-300 shadow-md"
                  />
                </div>
              )}
            </div>
            <div className="mb-2">
              <label className="font-medium">Rating: </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                disabled={!authUser?.id}
                className="ml-2 border p-1 rounded disabled:opacity-50"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!authUser?.id}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            Submit Review
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">All Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="border p-4 rounded-md">
                <p className="font-semibold mb-1">
                  Rating: {review.rating} / 5
                </p>
                <p className="mb-2">{review.review}</p>
                {review.image && (
                  <Image
                    src={review.image}
                    alt="Review"
                    width={150}
                    height={100}
                    className="rounded-md"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
