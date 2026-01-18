import torch.nn as nn
from huggingface_hub import PyTorchModelHubMixin

class CustomCNN(nn.Module, PyTorchModelHubMixin):
    def __init__(self):
        super(CustomCNN, self).__init__()
        
        # Initial model block
        self.block1 = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.LeakyReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.LeakyReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2)
        )
        
        # Second model block
        self.block2 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.LeakyReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.LeakyReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2)
        )
        
        # Third to fifth model blocks with modified residual blocks
        self.block3 = self._make_res_block(128, 128)
        self.block4 = self._make_res_block(128, 128)
        self.block5 = self._make_res_block(128, 128)
        
        # Fully connected layers
        self.fc1 = nn.Sequential(
            nn.Linear(128 * 6 * 6, 256),  # Adjust input size based on image dimensions
            # nn.Linear(4608, 256),   # For illustration purpose
            nn.LeakyReLU(inplace=True)
        )
        
        self.fc2 = nn.Sequential(
            nn.Linear(256, 128),
            nn.LeakyReLU(inplace=True)
        )
        
        self.fc3 = nn.Linear(128, 6)  # 6 labels
    
    def _make_res_block(self, in_channels, out_channels):
        return nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.LeakyReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2)
        )
    
    def forward(self, x):
        x = self.block1(x)
        x = self.block2(x)
        x = self.block3(x)
        x = self.block4(x)
        x = self.block5(x)
        
        # Flatten the output
        x = x.view(x.size(0), -1)
        
        x = self.fc1(x)
        x = self.fc2(x)
        x = self.fc3(x)
        
        return x