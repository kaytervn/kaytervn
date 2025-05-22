package android.onlinecoursesapp.adapter;

import android.content.Context;
import android.net.Uri;
import android.onlinecoursesapp.R;
import android.onlinecoursesapp.model.Document;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.MediaController;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class DocumentsAdapter extends RecyclerView.Adapter<DocumentsAdapter.DocumentViewHolder> {

    private Context context;
    private List<Document> documentList;

    public DocumentsAdapter(Context context, List<Document> documentList) {
        this.context = context;
        this.documentList = documentList;
    }

    @NonNull
    @Override
    public DocumentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.document_item, parent, false);
        return new DocumentViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DocumentViewHolder holder, int position) {
        Document document = documentList.get(position);
        holder.tvDocumentTitle.setText(document.getTitle());
        holder.tvDocumentDescription.setText(document.getDescription());

        String mediaUrl = document.getContent();

        // Setup MediaController
        MediaController mediaController = new MediaController(context);
        mediaController.setAnchorView(holder.vvDocumentMedia);
        holder.vvDocumentMedia.setMediaController(mediaController);

        holder.vvDocumentMedia.setVideoURI(Uri.parse(mediaUrl));
        holder.vvDocumentMedia.requestFocus();
        holder.vvDocumentMedia.setOnPreparedListener(mp -> holder.vvDocumentMedia.start());

        holder.vvDocumentMedia.setOnClickListener(v -> {
            if (!holder.vvDocumentMedia.isPlaying()) {
                holder.vvDocumentMedia.start();
            } else {
                holder.vvDocumentMedia.pause();
            }
        });
    }

    @Override
    public int getItemCount() {
        return documentList.size();
    }

    public static class DocumentViewHolder extends RecyclerView.ViewHolder {
        TextView tvDocumentTitle, tvDocumentDescription;
        VideoView vvDocumentMedia;

        public DocumentViewHolder(@NonNull View itemView) {
            super(itemView);
            tvDocumentTitle = itemView.findViewById(R.id.tvDocumentTitle);
            tvDocumentDescription = itemView.findViewById(R.id.tvDocumentDescription);
            vvDocumentMedia = itemView.findViewById(R.id.vvDocumentMedia);
        }
    }
}