package sample.iterator;

import java.util.List;

public class VersionIterator implements Iterator<Version> {
	private List<Version> versions;
	private int position;

	public VersionIterator(List<Version> versions) {
		this.versions = versions;
		this.position = 0;
	}

	@Override
	public boolean hasNext() {
		return position < versions.size();
	}

	@Override
	public Version next() {
		if (!hasNext()) {
			throw new IndexOutOfBoundsException();
		}
		return versions.get(position++);
	}
}