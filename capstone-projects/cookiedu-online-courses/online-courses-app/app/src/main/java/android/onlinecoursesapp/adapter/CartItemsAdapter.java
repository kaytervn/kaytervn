package android.onlinecoursesapp.adapter;

import android.content.Context;
import android.onlinecoursesapp.R;
import android.onlinecoursesapp.utils.APIService;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import java.util.List;
import android.onlinecoursesapp.model.Course;
import android.widget.Toast;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CartItemsAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int VIEW_TYPE_ITEM = 0;
    private static final int VIEW_TYPE_LOADING = 1;

    private Context context;
    private List<Course> courses;
    private APIService apiService;
    private String cartId;
    private Runnable updateTotalCostCallback;

    public void setData(List<Course> courses) {
        this.courses = courses;
        notifyDataSetChanged();
    }
    public CartItemsAdapter(Context context, List<Course> courses, APIService apiService, String cartId, Runnable updateTotalCostCallback) {
        this.context = context;
        this.courses = courses;
        this.apiService = apiService;
        this.cartId = cartId;
        this.updateTotalCostCallback = updateTotalCostCallback;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == VIEW_TYPE_ITEM) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.viewholder_cart, parent, false);
            return new ItemViewHolder(view);
        } else {
            View view = LayoutInflater.from(context).inflate(R.layout.course_loading_view, parent, false);
            return new CourseLoadingViewHolder(view);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof ItemViewHolder) {
            Course course = courses.get(position);
            ItemViewHolder itemViewHolder = (ItemViewHolder) holder;
            itemViewHolder.titleCourseCartTxt.setText(course.getTitle());
            itemViewHolder.priceCourseTxt.setText(String.valueOf(course.getPrice()));
            Glide.with(context).load(course.getPicture()).into(itemViewHolder.imageCourseCart);

            itemViewHolder.removeButton.setOnClickListener(v -> {
                removeCourseFromCart(cartId, course.getId(), position);
            });
        }
    }

    private void removeCourseFromCart(String cartId, String courseId, int position) {
        Call<ResponseBody> call = apiService.removeFromCart(cartId, courseId);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    courses.remove(position);
                    notifyItemRemoved(position);
                    notifyItemRangeChanged(position, courses.size());
                    Toast.makeText(context, "Course removed successfully", Toast.LENGTH_SHORT).show();
                    updateTotalCostCallback.run();
                } else {
                    Toast.makeText(context, "Failed to remove course", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(context, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public int getItemCount() {

        return this.courses == null ? 0 : courses.size();
    }

    @Override
    public int getItemViewType(int position) {
        return this.courses.get(position) == null ? VIEW_TYPE_LOADING : VIEW_TYPE_ITEM;
    }

    public static class ItemViewHolder extends RecyclerView.ViewHolder {
        ImageView imageCourseCart;
        TextView titleCourseCartTxt, priceCourseTxt, removeButton;

        public ItemViewHolder(@NonNull View itemView) {
            super(itemView);
            imageCourseCart = itemView.findViewById(R.id.imageCourseCart);
            titleCourseCartTxt = itemView.findViewById(R.id.titleCourseCartTxt);
            priceCourseTxt = itemView.findViewById(R.id.priceCourseTxt);
            removeButton = itemView.findViewById(R.id.btnRemoveFromCart);
        }
    }

    public static class CourseLoadingViewHolder extends RecyclerView.ViewHolder {
        ProgressBar progressBar;

        public CourseLoadingViewHolder(@NonNull View itemView) {
            super(itemView);
            progressBar = itemView.findViewById(R.id.progressBar);
        }
    }
}
