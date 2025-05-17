import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

function TaskModal({ isOpen, closeModal, task }) {
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // 🆕 for file upload
  const [localComments, setLocalComments] = useState([]);
  const [localAttachments, setLocalAttachments] = useState([]);

  useEffect(() => {
    if (task) {
      setLocalComments(task.comments || []);
      setLocalAttachments(task.attachments || []);
    }
  }, [task]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5174/api/tasks/${task._id}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success('Comment added 🎉');
      setLocalComments([...localComments, res.data.comments[res.data.comments.length - 1]]);
      setCommentText('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add comment ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5174/api/tasks/${task._id}/attachments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success('File uploaded 📎');
      setLocalAttachments(res.data.attachments);
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error('File upload failed ❌');
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold leading-6 text-gray-900">
                  {task.title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                  <p className="text-sm mb-1"><strong>Priority:</strong> {task.priority}</p>
                  <p className="text-sm mb-1"><strong>Status:</strong> {task.status}</p>
                  <p className="text-sm mb-1"><strong>Due Date:</strong> {task.dueDate?.slice(0, 10)}</p>

                  {/* Attachments Section */}
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">Attachments</h4>
                    <ul className="list-disc pl-5 mb-2">
                      {localAttachments.length > 0 ? (
                        localAttachments.map((attachment, index) => (
                          <li key={index}>
                            <a
                              href={`http://localhost:5174${attachment.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              {attachment.filename}
                            </a>
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No attachments yet.</p>
                      )}
                    </ul>

                    {/* Upload File */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border p-1 rounded text-sm"
                      />
                      <button
                        type="button"
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        onClick={handleUploadFile}
                        disabled={loading}
                      >
                        {loading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Comments</h4>
                    <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-100 mb-2">
                      {localComments.length > 0 ? (
                        localComments.map((comment, index) => (
                          <div key={index} className="mb-2">
                            <span className="font-bold text-sm">{comment.author?.name || 'User'}:</span>{' '}
                            <span className="text-sm">{comment.text}</span>
                            <div className="text-xs text-gray-400">
                              {moment(comment.createdAt).fromNow()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No comments yet.</p>
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-1 border p-2 rounded-l"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r"
                        onClick={handleAddComment}
                        disabled={loading}
                      >
                        {loading ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TaskModal;
